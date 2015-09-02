var store = require("./store");
var service = require("./service");
var plusString = require("node-plus-string");
var logger = require("../util/logger");

module.exports = function (io) {

	io.on("connection", function (socket) {

		var user = socket.handshake.session.user;
		socket.join(user.id);
		socket.emit("user", {
			id: user.id, 
			username: user.username, 
			name: user.name
		});

		service.getNewsListOfUser({user: user})
		.then(function (newsList) {
			socket.emit("newsList", newsList);
		}, function (err) {
			logger.error(err);
		});

		service.getContacters()
		.then(function (users) {
			socket.emit("contacters", users);
			
			store.addUser({user: user})
			.then(function (onlineUsers) {
				io.emit("onlineContacters", onlineUsers);
			}, function (err) {
				logger.error(err);
			});
		}, function (err) {
			logger.error(err);
		});

		socket.on("createChat", function (contacter) {
			service.createChat({
				name: "群聊",
				users: [contacter, user]
			})
			.then(function (chat) {
				socket.emit("chat", chat);
			}, function (err) {
				logger.error(err);
			})
		});

		socket.on("message", function (message) {
			// 转义html
			message.content = plusString.escapeHTML(message.content);
			service.createMessage(message)
			.then(function (msg) {
				for (var i in msg.chat.users) {
					// 想user的menu发送消息推送
					io.in(msg.chat.users[i].id).emit("news", msg);
					io.in(msg.chat.users[i].id).emit("message", msg);
				}
			}, function (err) {
				logger.error(err);
			});
		});

		socket.on("getHistory", function (data) {
			service.getHistoryList(data)
			.then(function (historyList) {
				if (historyList.length > 0) {
					for (var i in historyList) {
						var history = historyList[i];
						socket.emit("history", history);
					}
				} else {
					socket.emit("history", getSystemMessage(data.chat, "没有更多历史消息"));
				}
			}, function (err) {
				logger.error(err);
			})
		});

		socket.on("disconnect", function () {
			store.removeUser({user: user})
			.then(function (users) {
				io.emit("onlineContacters", users);
			}, function (err) {
				logger.error(err);
			});
		});
	});

	logger.log("socket: initialized");
}

function getSystemMessage (chat, content) {
	return {
		id: 0,
		chat: chat,
		user: {
			id: 0,
			username: "system",
			name: "system"
		},
		type: "system",
		content: content
	}
}
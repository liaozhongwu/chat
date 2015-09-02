var Q = require("q");
var userDao = require("../dao/user.js");
var chatDao = require("../dao/chat.js");
var messageDao = require("../dao/message.js");
var util = require("../util/util");
var logger = require("../util/logger");

// public
function login (params) {
	var defer = Q.defer();
	userDao.selectUserByUsernameAndPassword(params)
	.then(function (user) {
		defer.resolve(user);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function getUserByUsername (params) {
	var defer = Q.defer();
	userDao.selectUserByUsername(params)
	.then(function (user) {
		defer.resolve(user);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function register (params) {
	var defer = Q.defer();
	userDao.insertUser(params)
	.then(function (user) {
		defer.resolve(user);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function getContacters (params) {
	var defer = Q.defer();
	userDao.selectUsers(params)
	.then(function (users) {
		defer.resolve(users);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function getNewsListOfUser (params) {
	var defer = Q.defer();
	messageDao.selectNewsListOfUser(params)
	.then(fillChatOfMessages)
	.then(fillUserOfMessages)
	.then(function (newsList) {
		defer.resolve(newsList);
	})
	.catch(function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function createChat (params) {
	var defer = Q.defer();
	chatDao.selectChatOfUsers(params)
	.then(function (chat) {
		if (chat === null) {
			chatDao.insertChat(params)
			.then(function (chat) {
				defer.resolve(chat);
			}, function (err) {
				defer.reject(err);
			});
		} else {
			defer.resolve(chat);
		}
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function getChatById (params) {
	var defer = Q.defer();
	chatDao.queryChatById(params)
	.then(function (chat) {
		defer.resolve(chat);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function createMessage (params) {
	var defer = Q.defer();
	messageDao.insertMessage(params)
	.then(function (message) {
		defer.resolve(message);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function getMessageById (params) {
	var defer = Q.defer();
	messageDao.selectMessageById({id: 1})
	.then(fillChatOfMessage)
	.then(fillUserOfMessage)
	.then(function (message) {
		defer.resolve(message);
	})
	.catch(function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function getHistoryList (params) {
	var defer = Q.defer();
	messageDao.selectHistoryList(params)
	.then(fillChatOfMessages)
	.then(fillUserOfMessages)
	.then(function (historyList) {
		defer.resolve(historyList);
	})
	.catch(function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

// private 
function fillChatOfMessages (messages) {
	var defer = Q.defer();
	if (messages.length > 0) {
		for (var i = 0; i < messages.length; i++) {
			(function (index) {
				fillChatOfMessage(messages[i])
				.then(function (message) {
					if (index === messages.length - 1) {
						defer.resolve(messages);
					}
				}, function (err) {
					defer.reject(err);
				})
			})(i);
		}
	} else {
		defer.resolve(messages);
	}
	return defer.promise;
}

function fillUserOfMessages (messages) {
	var defer = Q.defer();
	if (messages.length > 0) {
		for (var i = 0; i < messages.length; i++) {
			(function (index) {
				fillUserOfMessage(messages[i])
				.then(function (message) {
					if (index === messages.length - 1) {
						defer.resolve(messages);
					}
				}, function (err) {
					defer.reject(err);
				})
			})(i);
		}	
	} else {
		defer.resolve(messages);
	}
	return defer.promise;
}

function fillChatOfMessage (message) {
	var defer = Q.defer();
	chatDao.selectChatById({id: message.chat.id})
	.then(function (chat) {
		message.chat = chat;
		defer.resolve(message);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function fillUserOfMessage (message) {
	var defer = Q.defer();
	userDao.selectUserById({id: message.user.id})
	.then(function (user) {
		message.user = user;
		defer.resolve(message);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

exports.login = login;
exports.getUserByUsername = getUserByUsername;
exports.register = register;
exports.getContacters = getContacters;
exports.getNewsListOfUser = getNewsListOfUser;
exports.getChatById = getChatById;
exports.createChat = createChat;
exports.getMessageById = getMessageById;
exports.createMessage = createMessage;
exports.getHistoryList = getHistoryList;

// test data
// userDao.insertUser({
// 	username: "aaa",
// 	name: "aaa",
// 	password: "aaa"
// }, function () {});
// userDao.insertUser({
// 	username: "bbb",
// 	name: "bbb",
// 	password: "bbb"
// }, function () {});
// userDao.insertUser({
// 	username: "ccc",
// 	name: "ccc",
// 	password: "ccc"
// }, function () {});
// userDao.insertUser({
// 	username: "ddd",
// 	name: "ddd",
// 	password: "ddd"
// }, function () {});

// chatDao.insertChat({
// 	name: "会话",
// 	users: [{id: 1}, {id: 2}]
// });
// chatDao.insertChat({
// 	name: "会话",
// 	users: [{id: 1}, {id: 3}]
// });
// chatDao.insertChat({
// 	name: "会话",
// 	users: [{id: 1}, {id: 4}]
// });
// messageDao.insertMessage({
// 	chat: {id: 1},
// 	user: {id: 1},
// 	type: "text",
// 	content: "message to bbb 1"
// });
// messageDao.insertMessage({
// 	chat: {id: 1},
// 	user: {id: 1},
// 	type: "text",
// 	content: "message to bbb 2"
// });
// messageDao.insertMessage({
// 	chat: {id: 1},
// 	user: {id: 1},
// 	type: "text",
// 	content: "message to bbb 3"
// });
// messageDao.insertMessage({
// 	chat: {id: 2},
// 	user: {id: 1},
// 	type: "text",
// 	content: "message to ccc 1"
// });
// messageDao.insertMessage({
// 	chat: {id: 2},
// 	user: {id: 1},
// 	type: "text",
// 	content: "message to ccc 2"
// });
// messageDao.insertMessage({
// 	chat: {id: 2},
// 	user: {id: 1},
// 	type: "text",
// 	content: "message to ccc 3"
// });
// messageDao.insertMessage({
// 	chat: {id: 3},
// 	user: {id: 1},
// 	type: "text",
// 	content: "message to ddd 1"
// });
// messageDao.insertMessage({
// 	chat: {id: 3},
// 	user: {id: 1},
// 	type: "text",
// 	content: "message to ddd 2"
// });
// messageDao.insertMessage({
// 	chat: {id: 3},
// 	user: {id: 1},
// 	type: "text",
// 	content: "message to ddd 3"
// });



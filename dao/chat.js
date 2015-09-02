var Q = require("q");
var Util = require("../util/util.js");
var DB = require("../src/database.js");

// public 
function selectChatById (params) {
	var defer = Q.defer();
	DB.select(
		"select * from chat as c, chat_user as cu, user as u where c.id = ? and cu.chat_id = c.id and cu.user_id = u.id", 
		[params.id]
	)
	.then(function (rows) {
		if (rows.length === 0) {
			defer.resolve(null);
			return;
		}
		var chat = {
			id: rows[0].c.id,
			name: rows[0].c.name,
			users: []
		}
		var row;
		for (var i in rows) {
			row = rows[i];
			chat.users.push({
				id: row.u.id,
				username: row.u.username,
				name: row.u.name
			});
		}
		defer.resolve(chat);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function selectChatOfUsers (params) {
	var defer = Q.defer();
	if (params.users.length !== 2) {
		defer.resolve(null);
		return;
	}
	DB.select(
		"select * from chat_user as cu1, chat_user as cu2 where cu1.chat_id = cu2.chat_id and cu1.user_id = ? and cu2.user_id = ? and cu1.chat_id not in (select chat_id from chat_user where user_id not in (?))",
		[params.users[0].id, params.users[1].id, [params.users[0].id, params.users[1].id]]
	)
	.then(function (rows) {
		if (rows.length === 0) {
			defer.resolve(null);
			return;
		}
		var id = rows[0].cu1.chat_id;
		selectChatById({id: id})
		.then(function (chat) {
			defer.resolve(chat);
		}, function (err) {
			defer.reject(err);
		});
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function insertChat (params) {
	var defer = Q.defer();
	DB.insert("insert into chat(name) values(?)", [params.name])
	.then(function (id) {
		params.id = id;
		insertChatUsers(params)
		.then(function () {					
			var chat = {
				id: params.id,
				name: params.name,
				users: params.users
			};
			defer.resolve(chat);
		}, function (err) {
			defer.reject(err);
		})
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function insertChatUsers (params) {
	var defer = Q.defer();
	if (params.users.length > 0) {
		for (var i = 0; i < params.users.length; ++i) {
			(function (index) {
				var user = params.users[index];
				DB.insert("insert into chat_user(chat_id, user_id) values(?, ?)", [params.id, user.id])
				.then(function (data) {
					if (index === params.users.length - 1) {
						defer.resolve();
					}
				}, function (err) {
					defer.reject(err);
				});
			})(i);
		}
	} else {
		defer.resolve();
	}
	return defer.promise;
}

exports.selectChatById = selectChatById;
exports.selectChatOfUsers = selectChatOfUsers;
exports.insertChat = insertChat;
exports.insertChatUsers = insertChatUsers;


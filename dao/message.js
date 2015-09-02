var Q = require("q");
var util = require("../util/util.js");
var db = require("../src/database.js");

function selectMessageById (params) {
	var defer = Q.defer();
	db.select(
		"select * from message as m where m.id = ?", 
		[params.id]
	)
	.then(function (rows) {
		if (rows.length === 0) {
			defer.resolve(null);
			return;
		}
		var row = rows[0];
		var message = {
			id: row.m.id,
			chat: {
				id: row.m.chat_id
			},
			user: {
				id: row.m.user_id
			},
			type: row.m.type,
			content: row.m.content
		}
		defer.resolve(message);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function selectNewsListOfUser (params) {
	var defer = Q.defer();
	db.select(
		"select * from message as m, chat_user as cu where cu.user_id = ? and cu.chat_id = m.chat_id and m.id not in (select m1.id from message as m1, message as m2 where m1.chat_id = m2.chat_id and m1.id < m2.id) order by m.createTime asc",
		[params.user.id]
	)
	.then(function (rows) {
		var newsList = [];
		for (var i in rows) {
			var row = rows[i];
			var news = {
				id: row.m.id,
				chat: {
					id: row.m.chat_id
				},
				user: {
					id: row.m.user_id
				},
				type: row.m.type,
				content: row.m.content
			}
			newsList.push(news);
		}
		defer.resolve(newsList);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function insertMessage (params) {
	var defer = Q.defer();
	db.insert(
		"insert into message(chat_id, user_id, type, content) values(?, ?, ?, ?)", 
		[params.chat.id, params.user.id, params.type, params.content]
	)
	.then(function (id) {
		var message = {
			id: id,
			chat: params.chat,
			user: params.user,
			type: params.type,
			content: params.content
		};
		defer.resolve(message);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function selectHistoryList (params) {
	var defer = Q.defer();
	var sql;
	var values;
	if (params.lastMessageId) {
		sql = "select * from message as m where m.chat_id = ? and m.id < ? order by m.id desc limit 0,?",
		values = [params.chat.id, params.lastMessageId, params.limit];
	} else {
		sql = "select * from message as m where m.chat_id = ? order by m.id desc limit 0,?",
		values = [params.chat.id, params.limit];
	}
	db.select(sql, values)
	.then(function (rows) {
		var historyList = [];
		for (var i in rows) {
			var row = rows[i];
			var history = {
				id: row.m.id,
				chat: {
					id: row.m.chat_id
				},
				user: {
					id: row.m.user_id
				},
				type: row.m.type,
				content: row.m.content
			}
			historyList.push(history);
		}
		defer.resolve(historyList);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}
exports.selectMessageById = selectMessageById;
exports.selectNewsListOfUser = selectNewsListOfUser;
exports.insertMessage = insertMessage;
exports.selectHistoryList = selectHistoryList;
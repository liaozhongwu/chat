var Q = require("q");
var db = require("../src/database.js");

function selectUserById (params) {
	var defer = Q.defer();
	db.select("select * from user where id = ?", [params.id])
	.then(function (rows) {
		if (rows.length == 0) {
			defer.resolve(null);
			return;
		}
		var row = rows[0];
		var user = {
			id: row.user.id,
			username: row.user.username,
			name: row.user.name
		}
		defer.resolve(user);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function selectUserByUsername (params) {
	var defer = Q.defer();
	db.select(
		"select * from user where username = ?", 
		[params.username]
	)
	.then(function (rows) {
		if (rows.length === 0) {
			defer.resolve(null);
			return;
		}
		var row = rows[0];
		var user = {
			id: row.user.id,
			username: row.user.username,
			name: row.user.name
		}
		defer.resolve(user);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function selectUserByUsernameAndPassword (params) {
	var defer = Q.defer();
	db.select(
		"select * from user where username = ? and password = ?", 
		[params.username, params.password]
	)
	.then(function (rows) {
		if (rows.length === 0) {
			defer.resolve(null);
			return;
		}
		var row = rows[0];
		var user = {
			id: row.user.id,
			username: row.user.username,
			name: row.user.name
		}
		defer.resolve(user);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function selectUsers (params) {
	var defer = Q.defer();
	db.select("select * from user", [])
	.then(function (rows) {
		var users = [];
		for (var i in rows) {
			var row = rows[i];
			var user = {
				id: row.user.id,
				username: row.user.username,
				name: row.user.name
			}
			users.push(user);
		}
		defer.resolve(users);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

function insertUser (params) {
	var defer = Q.defer();
	db.insert("insert into user set ?", params)
	.then(function (id) {
		var user = {
			id: id,
			username: params.username,
			name: params.name
		};
		defer.resolve(user);
	}, function (err) {
		defer.reject(err);
	});
	return defer.promise;
}

exports.selectUserById = selectUserById;
exports.selectUserByUsername = selectUserByUsername;
exports.selectUserByUsernameAndPassword = selectUserByUsernameAndPassword;
exports.selectUsers = selectUsers;
exports.insertUser = insertUser;
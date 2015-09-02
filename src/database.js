var Q = require("q");
var mysql = require("mysql");
var logger = require("../util/logger");

var conn = mysql.createConnection({
	host: "localhost",
	port: "3306",
	user: "root",
	password: "",
	database: "chat"
});

function select (sql, params) {
	var defer = Q.defer();
	conn.query({
		sql: sql,
		values: params,
		nestTables: true
	}, function (err, rows) {
		if (err) {
			defer.reject(err);
			return;
		}
		defer.resolve(rows);
	});
	return defer.promise;
};

function insert (sql, params) {
	var defer = Q.defer();
	conn.query(sql, params, function (err, data) {
		if (err) {
			defer.reject(err);
			return;
		}
		defer.resolve(data.insertId);
	});
	return defer.promise;
}

function update (sql, params) {
	var defer = Q.defer();
	conn.query(sql, params, function (err, data) {
		if (err) {
			defer.reject(err);
			return;
		}
		defer.resolve(data);
	});
	return defer.promise;
};

exports.select = select;
exports.insert = insert;
exports.update = update;
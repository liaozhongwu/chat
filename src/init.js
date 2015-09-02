var fs = require("fs");
var mysql = require("mysql");
var logger = require("../util/logger");

module.exports = function (callback) {
	var conn = mysql.createConnection({
		host: "localhost",
		port: "3306",
		user: "root",
		password: "",
	    multipleStatements: true
	});

	conn.connect(function (err) {
		if (err) {
			logger.error("database: connect error [" + err + "]");
			return;
		}

		fs.readFile(__dirname + "/sql/init.sql", function (err, data) {
			if (err) {
				logger.error("database: read file error [" + err + "]");
				return;
			}
			var sql = data.toString("utf-8");
			conn.query(sql, function (err) {
				if (err) {
					logger.log("database: init error [" + err + "]");
					return;
				}
				logger.log("database: initialized");
				callback();
			});
		});
	});
} 


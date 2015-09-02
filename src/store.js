var Q = require("q");
var util = require("../util/util");
var logger = require("../util/logger");
var users = [];

function addUser (param, callback) {
	var defer = Q.defer();
	if (param.user) {
		util.insertArray(users, param.user);
		defer.resolve(users);
	} else {
		defer.reject(new Error("invalid param"));
	}
	return defer.promise;
}

function getUsers (callback) {
	var defer = Q.defer();
	defer.resolve(users);
	return defer.promise;
}

function removeUser (param, callback) {
	var defer = Q.defer();
	if (param.user) {
		util.deleteArray(users, param.user);
		defer.resolve(users);
	} else {
		defer.reject(new Error("invalid param"));
	}
	return defer.promise;
}

exports.addUser = addUser;
exports.getUsers = getUsers;
exports.removeUser = removeUser;
require("./src/init.js")(function () {
	var express = require("express");
	var app = express();
	var logger = require("./util/logger");
	var http = require("http");
	var server = http.createServer(app).listen(80);
	logger.log("app: server is listening 80 port");
	var io = require("socket.io")(server);
	var session = require("express-session")({
	    secret: "liaozhongwu",
	    resave: true,
	    saveUninitialized: true
	});
	var socketSession = require("express-socket.io-session")(session);
	io.use(socketSession);
	io.use(function (socket, next) {
		if (socket.handshake.session && socket.handshake.session.user) {
			next();
		} else {
			next(new Error("not authorized"));
		}
	});
	var bodyParser = require("body-parser");
	var jade = require("jade");
	app.set("view engine", "jade");
	app.set("views", __dirname + "/views");
	app.use(express.static(__dirname + "/public"));
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(session);
	var router = require("./routers/router.js")(app);
	var socket = require("./src/socket.js")(io);
});
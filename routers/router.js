var formidable = require("formidable");
var service = require("../src/service");
var store = require("../src/store");
var logger = require("../util/logger");
var util = require("../util/util");

module.exports = function (app) {
	
	var noAuthUrls = ["/login", "/register", "/checkPassword.ajax", "/checkUsername.ajax"];

	app.use(function (req, resp, next) {
		var url = req.originalUrl;
		if (util.inArray(noAuthUrls, url) || req.session.user ) {
			next();
		} else {
			resp.redirect("/login");
		}
	});

	app.get("/", function (req, resp) {
		resp.render("menu", {user: req.session.user});
	});
	app.get("/login", function (req, resp) {
		resp.render("login", {});
	});
	app.post("/login", function (req, resp) {
		var username = req.body.username;
		var password = req.body.password;
		service.login({
			username: username,
			password: password
		})
		.then(function (user) {
			if (user) {
				req.session.user = user;
				resp.redirect("/");
			} else {
				resp.redirect("/login");
			}
		}, function (err) {
			logger.error("login: " + err);
		});
	});
	app.post("/checkPassword.ajax", function (req, resp) {
		var username = req.body.username;
		var password = req.body.password;
		service.login({
			username: username,
			password: password
		})
		.then(function (user) {
			if (user) {
				resp.setHeader("Content-Type", "application/json;charset=utf-8");
				resp.write(util.getSuccessJson({valid: true}, "检查密码成功"));
				resp.end();
			} else {
				resp.setHeader("Content-Type", "application/json;charset=utf-8");
				resp.write(util.getSuccessJson({valid: false}, "检查密码成功"));
				resp.end();
			}
		}, function (err) {
			logger.error("login: " + err);
		});
	});
	app.use("/logout", function (req, resp) {
		req.session.user = null;
		resp.redirect("/login");
	});
	app.get("/register", function (req, resp) {
		resp.render("register", {});
	});
	app.post("/register", function (req, resp) {
		var username = req.body.username;
		var name = req.body.name;
		var password = req.body.password;
		service.register({
			username: username,
			name: name,
			password: password,
		})
		.then(function (user) {
			logger.log("register: success");
			req.session.user = user;
			resp.redirect("/");
		}, function (err) {
			logger.error("register: " + err);
			resp.redirect("/register");
		});
	});
	app.post("/checkUsername.ajax", function (req, resp) {
		var username = req.body.username;
		service.getUserByUsername({
			username: username
		})
		.then(function (user) {
			if (user) {
				resp.setHeader("Content-Type", "application/json;charset=utf-8");
				resp.write(util.getSuccessJson({valid: false}, "检查用户名成功"));
				resp.end();
			} else {
				resp.setHeader("Content-Type", "application/json;charset=utf-8");
				resp.write(util.getSuccessJson({valid: true}, "检查用户名成功"));
				resp.end();
			}
		}, function (err) {
			logger.error(Err);
		})
	});
	app.get("/contacters", function (req, resp) {
		store.getContacters()
		.then(function (data) {
			resp.setHeader("Content-Type", "application/json;charset=utf-8");
			resp.write(util.getSuccessJson(data, "获取联系人成功"));
			resp.end();
		}, function (err) {
			resp.setHeader("Content-Type", "application/json;charset=utf-8");
			resp.write(util.getFailJson({}, "获取联系人失败"));
			resp.end();
		});
	});
	app.post("/chat/create", function (req, resp) {
		var name = req.body.name || "会话";
		var member = req.body.member;
		var user = req.session.user;
		service.createChat({
			name: name,
			users: [member, user]
		}, function (err, chat) {
			if (err) {
				logger.error("chat: " + err);
				return;
			}
			resp.setHeader("Content-Type", "application/json;charset=utf-8");
			resp.write(util.getSuccessJson(chat, "创建会话成功"));
			resp.end();
		});
	});
	app.get("/menu", function (req, resp) {
		resp.render("menu", {user: req.session.user});
	});
	app.post("/upload", function (req, resp) { 
		var form = new formidable.IncomingForm();
		form.uploadDir = __dirname + "/../public/upload_images";
		form.keepExtensions = true;
		form.hash = "md5";
		form.on("file", function (name, file) {
	    	resp.setHeader("Content-Type", "application/json;charset=utf-8");
	    	var pathSplit = file.path.split("/");
	    	var tmpName = pathSplit[pathSplit.length - 1];
			resp.write(JSON.stringify({url: "upload_images/" + tmpName}));
			resp.end();
		});
	    form.parse(req, function(err, fields, files) {});
	});

	logger.log("router: initialized");
}
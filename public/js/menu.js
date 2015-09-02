requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery.min',
        socketio: 'lib/socket.io',
        IScroll: 'lib/iscroll-probe',
        fastclick: 'lib/fastclick'
    }
});
require(['jquery', 'socketio', 'IScroll', 'fastclick', 'module/dialog', 'module/face', 'module/loading'], function ($, io, IScroll, FastClick, Dialog, Face, Loading) {
	var model = {
		messageType: {
			system: "system",
			text: "text",
			image: "image",
		},
		socket: {},
		user: {},
		chat: {},
		messages: [],
		dialog: {},
		face_message: {},
		loading_news: {},
		loading_message: {},
		iscroll_news: {},
		iscroll_contacter: {},
		iscroll_message: {},
		iscroll_setting: {},
	};
	var view = {
		showNews: function (news, notify) {
			// 表情文字转换为img
			if (news.type === model.messageType.system) { news.user.name = "系统消息"; }
			if (news.type === model.messageType.image) { news.content = "[图片]"; }
			var content = news.content.replace(/\[([0-9]*)\]/g, '<img class="face-text" src="face/$1.gif">');
			// 在news中插入消息
			var member_names = [];
			for (var i = 0; i < news.chat.users.length; ++i) {
				member_names.push(news.chat.users[i].name);
			} 
			var $news_list = $(".news-list");
			var $news_item = $(".news-item[data-chatid=" + news.chat.id + "]");
			if ($news_item.length > 0) {
				$news_item.find(".news-item-name").html(news.chat.name + "(" + member_names.join(", ") + ")");
				$news_item.find(".news-item-message").html(news.user.name + "：" + content);
			} else {
				var html = 
				'<div class="news-item" data-chatid="' + news.chat.id + '">' +
					'<div class="news-item-name">' + 
						news.chat.name + "(" + member_names.join(", ") + ")" +
					'</div>' +  
					'<div class="news-item-message">' +
						news.user.name + "：" + content + 
					'</div>' + 
				'</div>';
				$news_item = $(html);
				$news_item.on("click", function () {
					controller.handleChat(news.chat);
				});
			}
			$news_list.prepend($news_item);
			if (notify && window.Notification && Notification.permission === "granted" && news.user.id !== model.user.id) {
				var notification = new Notification(news.user.name, {
					body: news.content,
					icon: "image/avatar.png",
					sound: "audio/notify.m4a"
				});
				notification.onclick = function () {
					window.focus();
				}
				setTimeout(function () {
					notification.close();
				}, 3000);
			}
		},
		showTextMessage: function (message) {
			// 表情文字转换为img
			var content = message.content.replace(/\[([0-9]*)\]/g, '<img class="face-text" src="face/$1.gif">');
			//在chat中插入消息
			if (message.chat.id === model.chat.id) {
				var messageClass;
				if (message.user.id === model.user.id) {
					messageClass = "message-me";
				} else {
					messageClass = "message-other";
				}
				var html = 
					'<li class="message ' + messageClass + '">' + 
						'<div class="message-owner">' +
							'<div class="message-avatar">' +
								'<i class="iconfont icon-yonghu"></i>' +
							'</div>' +
							'<div class="message-name">' +
								message.user.name +
							'</div>' +
						'</div>' +
						'<div class="message-content">' + 
							content + 
						'</div>' + 
					'</li>';
				var $message = $(html);
				if (message.isHistory) {
					$(".messages").prepend($message);
					model.iscroll_message.scrollTop();
				} else {
					$(".messages").append($message);
					model.iscroll_message.scrollBottom();
				}
			}
		},
		showSystemMessage: function (message) {
			//在chat中插入消息
			if (message.chat.id === model.chat.id) {
				var html = 
					'<li class="message message-system">' + 
						'<div class="message-content">' + 
							message.content + 
						'</div>' + 
					'</li>';
				var $message = $(html);
				if (message.isHistory) {
					$(".messages").prepend($message);
					model.iscroll_message.scrollTop();
				} else {
					$(".messages").append($message);
					model.iscroll_message.scrollBottom();
				}
			}
		},
		showImageMessage: function (message) {
			console.log(message);
			//在chat中插入消息
			if (message.chat.id === model.chat.id) {
				var messageClass;
				if (message.user.id === model.user.id) {
					messageClass = "message-me";
				} else {
					messageClass = "message-other";
				}
				var html = 
					'<li class="message ' + messageClass + '">' +
						'<div class="message-owner">' +
							'<div class="message-avatar">' +
								'<i class="iconfont icon-yonghu"></i>' +
							'</div>' +
							'<div class="message-name">' +
								message.user.name +
							'</div>' +
						'</div>' +
						'<div class="message-content">' + 
							'<img class="image" src="' + message.content + '">' +
						'</div>' + 
					'</li>';
				var $message = $(html);
				var $image = $message.find(".image");
				if (message.isHistory) {
					$(".messages").prepend($message);
				} else {
					$(".messages").append($message);
				}
				$image.load(function () {
					if (message.isHistory) {
						model.iscroll_message.scrollTop();
					} else {
						model.iscroll_message.scrollBottom();
					}
				});
			}
		},
		showContacters: function (contacters) {
			var $contacters = $(".contacters");
			$contacters.empty();
			for (var i in contacters) {
				var contacter = contacters[i];
				(function (contacter) {
					if (contacter.id !== model.user.id) {
						var html = 
							'<li class="contacter contacter-offline" data-userid="' + contacter.id + '">' +
								'<div class="contacter-avatar">' + 
									'<i class="iconfont icon-yonghu"></i>' + 
								'</div>' +
								'<div class="contacter-name">' + 
									contacter.name + 
								'</div>' +
							'</li>';
						var $contacter = $(html);
						$contacters.append($contacter);
						$contacter.on("click", function () {
							controller.createChat(contacter);
						});
					}
				})(contacter);	
			}
		},
		showOnlineContacters: function (contacters) {
			var $contacters = $(".contacters");
			$(".contacter").removeClass("contacter-online").addClass("contacter-offline");
			for (var i in contacters) {
				var contacter = contacters[i];
				$(".contacter[data-userid=" + contacter.id + "]").removeClass("contacter-offline").addClass("contacter-online").prependTo($contacters);
			}
		},
		showChat: function (chat) {
			var $members = $(".members");
			var $messages = $(".messages");
			$members.empty();
			$messages.empty();
			for (var i in chat.users) {
				var member = chat.users[i];
				(function (member) {
					var html = 
						'<li class="member" data-id="' + member.id + '">' +
							'<div class="member-avatar">' + 
								'<i class="iconfont icon-yonghu"></i>' + 
							'</div>' +
							'<div class="member-name">' + 
								member.name + 
							'</div>' +
						'</li>';
					var $member = $(html);
					$members.append($member);
				})(member);	
			}
		}
	};
	var controller = {
		connect: function () {
			model.socket = io.connect(location.origin);
			model.socket.on('user', function (data) {
				model.user = data;
			});
			model.socket.on("newsList", function (data) {
				controller.handleNewsList(data);
			});
			model.socket.on("news", function (data) {
				controller.handleNews(data);
			});
			model.socket.on('message', function (data) {
				controller.handleMessage(data);
			});
			model.socket.on('history', function (data) {
				controller.handleHistory(data);
			})
			model.socket.on('contacters', function (data) {
				controller.addContacters(data);
			});
			model.socket.on('onlineContacters', function (data) {
				controller.onlineContacters(data);
			});
			model.socket.on('chat', function (data) {
				controller.handleChat(data);
			});
			return controller;
		},
		listen: function () {
			$(".menu-footer-item").on("click", function () {
				controller.switchPage(this);
			});
			$(".J-add").on("click", function () {
				$(".J-file").click();
			});
			$(".J-file").on("change", function () {
				for (var i = 0; i < this.files.length ; ++i) {
					var data = new FormData();
					data.append("image", this.files[i]);
					$.ajax({
						url: "/upload",
						type: "POST",
						data: data,
						contentType: false,
	    				processData: false,
						success: function (data) {
							controller.sendImageMessage(data.url);
						},
						error: function () {},
						complete: function () {}
					});
				}
				$(this).val("");
			});
			$(".J-face").on("click", function (event) {
				event.stopPropagation();
				model.iscroll_message.scrollBottom();
				model.face_message.toggle();
			});
			$("body").on("click", function (event) {
				model.face_message.hide();
			});
			$(".J-message").on("focus", function (event) {
				model.iscroll_message.scrollBottom();
				model.face_message.hide();
			});
			$(".J-message").on("keypress", function (event) {
				if (event.keyCode === 13) {
					if ($(".J-message").val()) {
						controller.sendTextMessage($(".J-message").val());
						$(".J-message").val("");
					}
				}
			});
			$(".J-clear").on("click", function () {
				$(".J-message").val("");
			});
			$(".J-send").on("click", function () {
				if ($(".J-message").val()) {
					controller.sendTextMessage($(".J-message").val());
					$(".J-message").val("");
				}
			});
			return controller;
		},
		switchPage: function (page) {
			var $page;
			if ($.type(page) === "string") {
				$page = $(".menu-footer-item[data-page=" + page + "]");
			} else {
				$page = $(page);
			}
			var $last = $page.siblings(".menu-footer-active");
			$last.removeClass("menu-footer-active");
			$page.addClass("menu-footer-active");
			var lastPage = $last.data("page");
			var page = $page.data("page");
			$(".menu-main").removeClass("menu-main-page-" + lastPage).addClass("menu-main-page-" + page);
		},
		handleNewsList: function (newsList) {
			for (var i in newsList) {
				var news = newsList[i];
				view.showNews(news, false);
			}
			model.loading_news.hide();
			if (newsList.length > 0) {
				var lastNews = newsList[newsList.length - 1]
				controller.setChat(lastNews.chat);
			} else {
				controller.switchPage("contacter");
			}
		},
		handleNews: function (news) {
			view.showNews(news, true);
		},
		handleMessage: function (message) {
			switch(message.type) {
				case model.messageType.system:
					view.showSystemMessage(message);
					break;
				case model.messageType.text:
					model.messages.push(message);
					view.showTextMessage(message);
					break;
				case model.messageType.image:
					model.messages.push(message);
					view.showImageMessage(message);
					break;
				default:
					break;
			}
		},
		handleHistory: function (history) {
			history.isHistory = true;
			controller.handleMessage(history);
		},
		getHistory: function () {
			if (model.messages && model.messages.length > 0) {
				var lastMessageId = model.messages[0].id;
				for (var i in model.messages) {
					var message = model.messages[i];
					if (message.id < lastMessageId) {
						lastMessageId = message.id;
					}
				}
				model.socket.emit("getHistory", {chat: model.chat, lastMessageId: lastMessageId, limit: 5});
			} else {
				model.socket.emit("getHistory", {chat: model.chat, limit: 5});
			}
		},
		sendTextMessage: function (content) {
			model.face_message.hide();
			if (model.chat) {
				var message = {
					type: model.messageType.text,
					chat: model.chat,
					user: model.user,
					content: content
				}
				model.socket.emit("message", message);
			}
			return controller;
		},
		sendImageMessage: function (content) {
			if (model.chat) {
				var message = {
					type: model.messageType.image,
					chat: model.chat,
					user: model.user,
					content: content
				}
				model.socket.emit("message", message);
			}
			return controller;
		},
		addContacters: function (contacters) {
			view.showContacters(contacters);
		},
		onlineContacters: function (contacters) {
			view.showOnlineContacters(contacters);
		},
		createChat: function (contacter) {
			model.socket.emit("createChat", contacter);
		},
		handleChat: function (chat) {
			controller.switchPage("chat");
			controller.setChat(chat);
		},
		setChat: function (chat) {
			if (model.chat.id !== chat.id) {
				model.chat = chat;
				model.messages = [];
				view.showChat(model.chat);
				controller.getHistory();
			}
		}
	}; 
	$(function () {
		FastClick.attach(document.body);
		if (window.Notification) { Notification.requestPermission(); }
		$(document).on("touchmove", function (e) {e.preventDefault();});		
		model.face_message = new Face({
			parent: $(".message-wrapper"),
			target: $(".J-message"),
			showEndFunction: function () {
				model.iscroll_message.scrollBottom();
			},
			hideEndFunction: function () {
				model.iscroll_message.scrollBottom();
			}
		});
		model.loading_news = new Loading({
			type: "module",
			target: $(".news-wrapper")
		});
		model.loading_news.show();
		model.loading_message = new Loading({
			type: "module",
			target: $(".message-wrapper")
		});
		model.iscroll_news = new IScroll('.news-wrapper', {
			probeType: 1
		});
		model.iscroll_contacter = new IScroll('.contacter-wrapper', {
			probeType: 1
		});
		model.iscroll_message = new IScroll('.message-wrapper', {
			probeType: 3,
			tap: true
		});
		model.iscroll_message.scrollTop = function () {
			model.iscroll_message.refresh();
			model.iscroll_message.scrollTo(0, 0, 300);
		}
		model.iscroll_message.scrollBottom = function () {
			model.iscroll_message.refresh();
			model.iscroll_message.scrollTo(0, model.iscroll_message.wrapperHeight - model.iscroll_message.scrollerHeight, 300);
		}
		var lastScrollValid = false;
		model.iscroll_message.on("scroll", function () {
			if (this.y > 0) {
				if (this.y > 20) {
					model.loading_message.show();
				} else {
					model.loading_message.hide();
				}
			}
		});
		model.iscroll_message.on("mouseup", function () {
			if (this.y > 20) {
				lastScrollValid = true;
			} else {
				lastScrollValid = false;
			}
		});
		model.iscroll_message.on("scrollEnd", function () {
			if (lastScrollValid) {
				lastScrollValid = false;
				controller.getHistory();
			}
		});
		model.iscroll_setting = new IScroll('.setting-wrapper', {
			probeType: 1
		});
		controller.connect().listen();
	});
});

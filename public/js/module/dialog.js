define(['jquery'], function ($) {
	
	function Dialog (conf) {
		this.init(conf);
	}
	Dialog.prototype = {
		init: function (conf) {

		},
		diy: function (conf) {
			var config = {
				width: 0,
				height: 0,
				content: ''
			};
			$.extend(config, conf);

			var html = 
				'<div class="dialog-wrapper">' +
					'<div class="dialog">' +
						'<div class="dialog-content">' +
							config.content +
						'</div>' +
					'</div>' +
				'</div>';
			var $dialog = $(html);
			$dialog.appendTo($("body"));
			$dialog.find(".dialog").css({
				width: config.width,
				height: config.height,
				marginLeft: - config.width / 2,
				marginTop: - config.height / 2
			});
			this.$dialog = $dialog;
			if (config.callback) {
				config.callback.call(this);
			}
		},
		alert: function (conf) {
			var that = this;
			var config = {
				width: 0,
				height: 0,
				autoClose: true,
				title: '警告',
				content: '警告',
				confirmText: '确认',
				confirmCallback: function () {}
			};
			$.extend(config, conf);
			var html = 
				'<div class="dialog-wrapper">' +
					'<div class="dialog">' + 
						'<div class="dialog-header text-center">' +
							config.title + 
						'</div>' +
						'<div class="dialog-content">' +
							config.content +
						'</div>' +
						'<div class="dialog-footer">' +
							'<input class="btn btn-warning J-confirm" type="button" value="' + config.confirmText + '">' + 
						'</div>' +
					'</div>' +
				'</div>';
			var $dialog = $(html);
			$dialog.appendTo($("body"));

			if (config.width) {
				$dialog.find(".dialog").css({
					width: config.width,
					marginLeft: - config.width / 2
				});
			}

			if (config.autoClose) {
				setTimeout(function () {
					that.close();
					if (config.callback instanceof Function) {
						config.callback.call(that);
					}
				}, 1000);
			}

			$dialog.find(".J-confirm").click(function () {
				that.close();
				if (config.callback instanceof Function) {
					config.callback.call(that);
				}
			});

			this.$dialog = $dialog;
		},
		confirm: function () {
			
		},
		close: function () {
			this.$dialog.hide();
		}
	}

	return Dialog;
});
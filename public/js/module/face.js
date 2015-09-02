define(['jquery', 'IScroll'], function ($, IScroll) {

	function Face (conf) {
		this.init(conf);
	}
	Face.prototype = {
		init: function (conf) {
			var that = this;
			var config = {
				parent: $("body"),
				target: $("input"),
				showStartFunction: function () {},
				showEndFunction: function () {},
				hideStartFunction: function () {},
				hideEndFunction: function () {}
			}
			$.extend(config, conf);
			that.config = config;

			var $face = config.parent.find(".face-wrapper");
			if ($face.length == 0) {
				var $face = $("<div>").addClass("face-wrapper");
				var $face_content = $("<ul>").addClass("face").appendTo($face); 
				for (var i = 1; i <= 15; ++i) {
					(function (name) {
						var $item = $("<li>").addClass("face-item");
						var $image = $("<img>").addClass("face-img").attr("src", "face/" + name + ".gif").appendTo($item);
						$item.on("click", function (event) {
							event.stopPropagation();
							config.target.val(config.target.val() + '[' + name + ']');
						})
						.appendTo($face_content);
					})(i);
				}
				$face.hide().appendTo(config.parent);
			}
			that.$face = $face;
			that.isHidden = true;
		},
		show: function (callback) {
			var that = this;
			if (that.isHidden) {
				that.isHidden = false;
				that.config.showStartFunction();
				that.$face.stop().slideDown(300, function () {
					that.config.showEndFunction();
					if (callback) {
						callback();
					}
				});
			}
		},
		hide: function (callback) {
			var that = this;
			if (!that.isHidden) {
				that.isHidden = true;
				that.config.hideStartFunction();
				that.$face.stop().slideUp(300, function () {
					that.config.hideEndFunction();
					if (callback) {
						callback();
					}
				});
			}
		},
		toggle: function (callback) {
			var that = this;
			if (that.isHidden) {
				that.show();
			} else {
				that.hide();
			}
		}
	}

	return Face;
});
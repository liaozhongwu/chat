requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery.min',
        fastclick: 'lib/fastclick'
    }
});
require(['jquery', 'fastclick', "module/dialog"], function ($, FastClick, Dialog) {
	var dialog = new Dialog();
	$(function () {
		FastClick.attach(document.body);
		$(".login-box").submit(function () {
			if (checkEmpty($(".J-username"), "请输入用户名") && 
				checkEmpty($(".J-password"), "请输入密码") &&
				checkPassword()
			) {
				return true;
			} else {
				return false;
			}
		});
	});
	function checkEmpty ($input, emptyMsg) {
		if ($input.val()) {
			return true;
		} else {
			showError(emptyMsg);
			return false;
		}
	}
	function checkPassword () {
		var username = $(".J-username").val();
		var password = $(".J-password").val();
		var valid = false;
		$.ajax({
			url: "checkPassword.ajax",
			data: {username: username, password: password},
			type: "post",
			async: false,
			success: function (result) {
				if (result.success && result.data) {
					valid = result.data.valid;
				}
			}
		});
		if (valid) {
			return true; 
		} else {
			showError("用户名或密码错误");
			return false;
		}
	}
	function showError(errMsg) {
		dialog.alert({
			content: errMsg
		});
	}
});
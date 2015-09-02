requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery.min',
        fastclick: 'lib/fastclick'
    }
});
require(['jquery', 'fastclick'], function ($, FastClick) {
	var dialog = new Dialog();
	$(function () {
		FastClick.attach(document.body);
		$(".register-box").submit(function () {
			if (checkEmpty($(".J-username"), "请输入用户名") && 
				checkUsername() &&
				checkEmpty($(".J-name"), "请输入昵称") &&
				checkEmpty($(".J-password"), "请输入密码") &&
				checkEmpty($(".J-repassword"), "请重复输入密码") &&
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
	function checkUsername () {
		var username = $(".J-username").val();
		var valid = false;
		$.ajax({
			url: "checkUsername.ajax",
			data: {username: username},
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
			showError("用户名已存在");
			return false;
		}
	}
	function checkPassword () {
		var password = $(".J-password").val();
		var repassword = $(".J-repassword").val();
		if (password === repassword) {
			return true;
		} else {
			showError("密码不一致");
			return false;
		}
	}
	function showError(errMsg) {
		dialog.alert({
			content: errMsg
		});
	}
});
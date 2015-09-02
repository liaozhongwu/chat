module.exports = {
	isFunction: function (func) {
		return Object.prototype.toString.call(func) === "[object Function]";
	},
	inArray: function (array, item) {
		if (array instanceof Array) {
			for (var i in array) {
				if (array[i] === item) {
					return true;
				}
				if (array[i].id && item.id && array[i].id === item.id) {
					return true;
				}
			}
		}
		return false;
	},
	insertArray: function (array, item) {
		if (array instanceof Array) {
			if (!this.inArray(array, item)) {
				array.push(item);
			}
		}
		return false;
	},
	deleteArray: function (array, item) {
		if (array instanceof Array) {
			var index;
			for (var i in array) {
				if (array[i] === item) {
					index = i;
				}
			}
			if (index) {
				array.splice(index, 1);
				return true;
			}
		}
		return false;
	},
	getSuccessJson: function (data, msg) {
		var json = {
			success: true,
			data: data || {},
			msg: msg || "请求成功"
		};
		return JSON.stringify(json);
	},
	getFailJson: function (data, msg) {
		var json = {
			success: false,
			data: data || {},
			msg: msg || "请求失败"
		}
		return JSON.stringify(json);
	} 
}
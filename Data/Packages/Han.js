/*jshint node: true */
"use strict";
var fs = require("fs");


// 插件中要删除文案的项目的ID
var fixDate = {
	"package-settings": true,
	preferences: true
};


// 要汉化的文案
var hanDate = {
	"Key Bindings – Default": "按键绑定 – 默认",
	"Key Bindings – User": "按键绑定 – 用户",
	"Settings – Default": "设置 – 默认",
	"Settings – User": "设置 – 用户"
};

/**
 * 深度遍历对象进行汉化与删除
 */
function fixObj(obj) {
	if (Array.isArray(obj)) {
		obj.forEach(fixObj);
	} else if (typeof obj === "object") {
		if (obj.caption) {
			if (obj.id && fixDate[obj.id]) {
				obj.caption = null;
				delete obj.caption;
			} else {
				obj.caption = hanDate[obj.caption] || obj.caption;
			}
		}
		for (var i in obj) {
			fixObj(obj[i]);
		}
	}
	return obj;
}

/**
 * 查找各插件自带的Main.sublime-menu，删除与Default、Package Control插件重复的部分
 */
fs.readdir(".", function(err, files) {
	if (err) {
		console.log("read dir error");
	} else {
		files.forEach(function(item) {
			if (item !== "Default" && item !== "Package Control") {
				item = item + "/Main.sublime-menu";
				fs.readFile(item, function(err, data) {
					if (!err) {
						data = JSON.parse(data);
						var oldDataJson = JSON.stringify(data, 0, 4);

						var newDataJson = JSON.stringify(fixObj(data), 0, 4);
						if (oldDataJson !== newDataJson) {

							fs.writeFile(item, newDataJson, function(err) {
								if (!err) {
									console.log("Modified:\t" + item);
								}
							});
						} else {
							console.log("ok:\t" + item);
						}

					}
				});
			}
		});
	}
});

/**
 * 根据是v2版还是v3版启用主菜单汉化文件
 */
(function(){
	var ver = __dirname.match(/Sublime[\s-]Text[\s-](\d)/i);
	if (ver) {
		ver = parseInt(ver[1]);
	} else {
		ver = fs.existsSync("../../PackageSetup.py") ? 2 : 3;
	}
	var menu = "Default/Main.sublime-menu";
	fs.rename("Default/Main." + ver, menu, function(err) {
		if (!err) {
			console.log("Modified:\t" + menu);
		} else {
			console.log("ok:\t" + menu);
		}
	});
})();

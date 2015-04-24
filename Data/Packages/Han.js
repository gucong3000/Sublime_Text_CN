/*jshint node: true */
"use strict";
var fs = require("fs-extra") || require("fs");

if (!fs.outputFile) {
	fs.outputFile = fs.writeFile
}

// 插件中要删除文案的项目的ID
var fixDate = {
	"package-settings": true,
	preferences: true,
	tools: true,
	edit: true
};


// 要汉化的文案
var hanDate = {
	"Compact (Break Selectors, No Spaces)": "紧凑 (选择符折行，无空格)",
	"Expanded (Break Selectors)": "展开 (选择符折行)",
	"Compact (Break Selectors)": "紧凑 (选择符折行)",
	"Compact (No Spaces)": "紧凑 (无空格)",
	"Compressed": "压缩",
	"Expanded": "展开",
	"Compact": "紧凑",
	"Set Keyboard Shortcuts": "设置键盘快捷方式",
	"View README in Github": "在Github上阅读文档",
	"Key Bindings – Example": "按键绑定 – 示例",
	"Key Bindings – Default": "按键绑定 – 默认",
	"Set Linting Preferences": "设置效验规则",
	"Set File Encoding to": "设置文件编码为",
	"Reload with Encoding": "按编码重新加载",
	"Key Bindings – User": "按键绑定 – 用户",
	"Set Plugin Options": "设置插件选项",
	"Set `node` Path": "设置“node”路径",
	"Settings – Default": "设置 – 默认",
	"Settings - Default": "设置 – 默认",
	"Settings – User": "设置 – 用户",
	"Settings - User": "设置 – 用户",
	"Clear Annotations": "清除批注",
	"Lint Code": "效验代码",
	"Traditional": "-繁体 ",
	"Simplified": "-简体 ",
	"Japanese": "日语 ",
	"Chinese": "中文",
	"Korean": "韩语 ",
	"README": "文档",
};

// 按单词翻译英文句子
function world2han(wold) {
	return wold.replace(/\s*(\w+)\s*/g, function(s, wold) {
		return hanDate[wold] || s;
	});
}

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
				obj.caption = hanDate[obj.caption] || world2han(obj.caption);
			}
		}
		for (var i in obj) {
			fixObj(obj[i]);
		}
	}
	return obj;
}

function hanJsonFile(data, path) {
	try {
		data = JSON.parse(data);
	} catch (ex) {
		try {
			data = eval.call(null, "(" + data + ")");
		} catch (ex) {

		}
	}
	if (data) {
		var oldDataJson = JSON.stringify(data, 0, 4);

		var newDataJson = JSON.stringify(fixObj(data), 0, 4);
		if (oldDataJson !== newDataJson) {

			fs.outputFile(path, newDataJson, function(err) {
				if (!err) {
					console.log("Modified:\t" + path);
				} else {
					console.log(err);
				}
			});
		} else {
			console.log("ok:\t" + path);
		}
	}
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
						hanJsonFile(data, item);
					}
				});
			}
		});
	}
});
var AdmZip = require("adm-zip"),
	regExtName = /\.sublime-package$/;

if (AdmZip) {
	fs.readdir("../Installed Packages", function(err, files) {
		if (err) {
			console.log("read dir error");
		} else {
			files.forEach(function(item) {
				var data;
				if (/\.sublime-package$/.test(item) && !/(Default|Package Control)/.test(item)) {
					try {
						data = new AdmZip("../Installed Packages/" + item).readAsText("Main.sublime-menu");
					} catch (ex) {

					}
					if (data) {
						item = item.replace(regExtName, "/Main.sublime-menu");
						hanJsonFile(data, item);
					}
				}
			});
		}
	});
}

/**
 * 根据是v2版还是v3版启用主菜单汉化文件
 */
(function() {
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
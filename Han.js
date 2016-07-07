#!/usr/bin/env node

"use strict";
var fs = require("fs-extra") || require("fs"),
	AdmZip = require("adm-zip"),
	path = require("path"),
	dirRoot,
	dirData,
	dirPackages,
	fileCache = {};

if (!fs.outputFile) {
	fs.outputFile = fs.writeFile;
	fs.createOutputStream = fs.createWriteStream;
}
if (!fs.createOutputStream) {
	fs.createOutputStream = fs.createWriteStream;
}

/**
 * 输出授权文件
 * @param  {Number} ver Sublime Text的版本号，2或3
 */
function outputLicense(ver) {
	var filePath = path.join(dirData, (ver === 3 ? "Local" : "Settings"), "License.sublime_license");
	// 先检查本地是否已有授权文件，已有则不再输出文件
	fs.stat(filePath, (err, stats) => {
		if (err || !stats.size) {
			var data = ver === 3 ? new Buffer(process.platform === "win32" ? "+ADCJxugmgblbEaI/qgHwF/OBYC70TrQQquczJONLet75Trl2VLIKsVYBZW3iinvf6ADtv5BmgjJSGqorYFExlu3E+ijAYt3mB4F/p/Xe7BZtGflowSIBZBvOoX+oAi6WLJv8KsT+wLmHUnw6NNEwC61boDaBf5kmG5O9Z3WdrU6uW6BqneMcZALPvXvpXe0W8JchNoKi33hbkzmm6J8s1+xYva7cYlykWk+g+nEesAiwmGDqwewBpATOoPo0QujKMZjg64AjHSAEzv+56B6sSigEIejdfl14WoF/+2ieLAosxXl3XeNApceO/L+1wiwI8Nl9KMT/n2Vbjny5tRExVnDFfKuBYtkmGo7h+/TerI6tm6D2geIdpMLToKdoQrGKrdc96sD+XaVaUrmmqYMwC64Y/C7cI4H5mk48erEDbZfw2f2o3CwdOZuTPedoQijXrkSht5w/weAbzyH66APxyugZvSoAowHkx0FJF5wrAOOoBOL3xP2DeNuQZWbxKwDjmLWUQ==" : "jWFcOJwg8qRBJCMFOtAyVSqvm588UVJy5uP5QVf1GH4OhKT6XtKgiGEQYBhz8hx6CsGdqXnB8qptAA8laflxUy7WjfckgePVPFZgc1uvTiUs1fn6JITgpzQnXwg62D0vLdPx7yyTk6BCVSx9LKtxVVvU8J9dhZbGPCYreFmuQyBP2PCeLffk0zRDW3gr3UIhLqPCm12K499FJilrX9pJJirQ/Ok88eHQNSFbDi28T1VXo/+cLIfYpDRbXw4sqT42Xaf9nCmA5NYkW15zI9hPJF3Bjpgk9ZHXRSJgcinaTSVd0ov6WvfloDNWXn86rz0lVqL76ySTlt8xJlx/IqxxUCyii+0phePGPCJeCiurTydP1/CcXYfg1DdDKw9Z2T9TX9bC6CyDkdQxIS9rXt45VVvZ/e888OalQiFdfC68OCMqovnpJPDY1kImKXpZ2T02K9iMmVnwl6UkJ1kKL9g6Ul7B+OsvguSlN1VgqZoImZb7wY2UWJOer0cmJBhfvJmW+wNITg==", "base64") : `----- BEGIN LICENSE -----
Andrew Weber
Single User License
EA7E-855605
813A03DD 5E4AD9E6 6C0EEB94 BC99798F
942194A6 02396E98 E62C9979 4BB979FE
91424C9D A45400BF F6747D88 2FB88078
90F5CC94 1CDC92DC 8457107A F151657B
1D22E383 A997F016 42397640 33F41CFC
E1D0AE85 A0BBD039 0E9C8D55 E1B89D5D
5CDB7036 E56DE1C0 EFCC0840 650CD3A6
B98FC99C 8FAC73EE D2B95564 DF450523
------ END LICENSE ------`;
			fs.outputFile(filePath, data, err => {
				if (!err) {
					console.log("License:\t" + filePath);
				}
			});
		}
	});
}

function contextMenu() {
	// 写入鼠标右键菜单
	switch (process.platform) {
		case "win32":
			var cmd = path.join(dirRoot, "sublime_text.exe");
			cmd = `reg add "HKCR\\*\\shell\\Open with Sublime Text" /ve /d "用Sublime Text打开" /f
reg add "HKCR\\*\\shell\\Open with Sublime Text" /v Icon /d "\\"${cmd}\\",0" /f
reg add "HKCR\\*\\shell\\Open with Sublime Text\\Command" /ve /d "\\"${cmd}\\" \\"%1^\\"" /f
reg add HKCR\\Directory\\shell\\sublime_text /ve /d "添加到Sublime Text工程项目" /f
reg add HKCR\\Directory\\shell\\sublime_text /v Icon /d "\\"${cmd}\\",0" /f
reg add HKCR\\Directory\\shell\\sublime_text\\Command /ve /d "\\"${cmd}\\" \\"%1^\\"" /f
reg add HKCR\\Directory\\Background\\shell\\sublime_text /ve /d "添加到Sublime Text工程项目" /f
reg add HKCR\\Directory\\Background\\shell\\sublime_text /v Icon /d "\\"${cmd}\\",0" /f
reg add HKCR\\Directory\\Background\\shell\\sublime_text\\Command /ve /d "\\"${cmd}\\" \\"%V^\\"" /f`.replace(/(\r?\n)+/g, "&&");
			require("child_process").exec(cmd, (error) => {
				if (!error) {
					console.log("Context menu write done.");
				}
			});
			break;
		case "linux":
			fs.access("/usr/share/applications/sublime_text.desktop", fs.F_OK, err => {
				if (!err) {
					var filePath = "/usr/share/applications/defaults.list";
					fs.readFile(filePath, (err, data) => {
						if (!err && data) {
							data = data.toString();
							var newData = data.replace(/=gedit\.desktop(\n|$)/g, "=sublime_text.desktop$1");
							if (data === newData) {
								console.log("Context menu exist.");
							} else {
								// 写文件
								fs.writeFile(filePath, data.toString().replace(/=gedit\.desktop(\n|$)/g, "=sublime_text.desktop$1"), err => {
									if (!err) {
										console.log("Context menu write done.");
									}
								});
							}
						}
					});
				}
			});
	}
}

/**
 * 自动安装Package Control
 */
function installPackage() {
	var filePath = path.join(dirData, "Installed Packages/Package Control.sublime-package");
	fs.stat(filePath, (err, stats) => {
		if (err || !stats.size) {
			console.log("正在下载插件：\tPackage Control");
			require("request")("https://packagecontrol.io/Package%20Control.sublime-package").pipe(fs.createOutputStream(filePath));
			process.on("exit", () => {
				console.log("Package Control已安装，请重启Sublime Text。然后重启本程序");
			});
		}
	});
}

/**
 * 修改各插件配置
 */
function settings() {
	var cfgs = {
		"Autoprefixer": {
			"browsers": ["none"]
		},
		"CSScomb": {
			"config": {
				// 最后一个属性后是否添加封号
				"always-semicolon": true,
				// 代码块缩进字符，包括媒体查询和套式规则。
				"block-indent": "\t",
				// 统一颜色大小写
				"color-case": "lower",
				// 使用颜色的缩写
				"color-shorthand": true,
				// 元素选择器的大小写
				"element-case": "lower",
				// 文件结尾添加或删除空行
				"eof-newline": true,
				// 要排除的文件
				"exclude": [
					".git/**",
					".hg/**",
					"bower_components/**",
					"node_modules/**"
				],
				// 添加或删除前导0
				"leading-zero": false,
				// 引号风格
				"quotes": "double",
				// 删除空的规则
				"remove-empty-rulesets": true,
				// 默认排序方式
				"sort-order-fallback": "abc",
				// 规则中`:`后的字符
				"space-after-colon": " ",
				// `>`之后的字符(如`p > a`)
				"space-after-combinator": " ",
				// 在`{`之后的字符
				"space-after-opening-brace": "\n",
				// 选择符中`,`之后的字符
				"space-after-selector-delimiter": "\n",
				// `}`之后的字符
				"space-before-closing-brace": "\n",
				// `:`之前的字符
				"space-before-colon": "",
				// `>`之前的字符(如`p > a`)
				"space-before-combinator": " ",
				// `{`之前的字符。
				"space-before-opening-brace": " ",
				// 选择符中`,`之前的字符
				"space-before-selector-delimiter": "",
				// 每个属性的之间的分隔符
				"space-between-declarations": "\n",
				// 去除多余的空白字符
				"strip-spaces": true,
				// tab的大小
				"tab-size": false,
				// 取值为0时删除单位
				"unitless-zero": true,
				// 为私有属性前缀对齐
				"vendor-prefix-align": false,
			}
		},
		"FixMyJS": {
			"fixOnSave": true
		},
		"JavaScript": {
			"extensions": [
				"es6"
			]
		},
		"JsFormat": {
			// exposed jsbeautifier options
			"indent_with_tabs": true,

			// jsformat options
			"format_on_save": true,
			"jsbeautifyrc_files": true
		},
		"JSON": {
			"extensions": [
				"babelrc",
				"jsbeautifyrc",
				"jshintrc",
				"stylelintrc",
				"sublime-commands",
				"sublime-menu",
				"sublime-settings",
			]
		},
		"HTML": {
			"extensions": [
				"htc"
			]
		},
		"Package Control": {
			"installed_packages": [
				"Autoprefixer",
				"BracketHighlighter",
				"ConvertToUTF8",
				"CSScomb",
				"DocBlockr",
				"Emmet",
				"FixMyJS",
				"HTML-CSS-JS Prettify",
				"IMESupport",
				"jQuery",
				"JsFormat",
				"LESS",
				"Nodejs",
				"Sass",
				"SFTP",
				"SideBarEnhancements",
				"SublimeCodeIntel",
				"SublimeLinter",
				"SublimeLinter-contrib-htmlhint",
				"SublimeLinter-contrib-stylelint",
				"SublimeLinter-jshint",
				"SublimeLinter-php",
				"Terminal"
			]
		},
		"Preferences": {
			"default_line_ending": "unix",
			"dpi_scale": 1,
			"show_encoding": true,
			"show_line_endings": true,
			"tab_size": 4,
			"translate_tabs_to_spaces": false
		},
		"SFTP": {
			"email": "xiaosong@xiaosong.me",
			"product_key": "d419f6-de89e9-0aae59-2acea1-07f92a"
		},
		"SublimeLinter": {
			"user": {
				"show_errors_on_save": true
			}
		},
	};

	function mergeArray(target, sources) {
		sources.forEach(item => {
			if (target.indexOf(item) < 0) {
				target.push(item);
			}
		});
		return target;
	}

	// 更新各插件配置
	function upCfg(pakName) {
		var filePath = path.join(dirData, "Packages/User/" + pakName + ".sublime-settings");
		fs.readFile(filePath, (err, data) => {
			if (!err) {

				// 尝试将文件内容转json
				try {
					data = JSON.parse(data);
				} catch (ex) {
					try {
						data = eval.call(null, "(" + data + ")");
					} catch (ex) {
						err = ex;
					}
				}
			}

			if (err) {
				// 配置文件读取错误则直接使用新配置
				data = JSON.stringify(cfgs[pakName], null, "\t");
			} else {

				// 合并所有配置项中的数组
				var oldData = JSON.stringify(data, null, "\t");
				for (var key in cfgs[pakName]) {
					if (Array.isArray(data[key]) && Array.isArray(cfgs[pakName][key])) {
						data[key] = mergeArray(data[key], cfgs[pakName][key]);
					}
				}

				// 用老配置覆盖新配置
				var newDataJson = JSON.stringify(Object.assign(cfgs[pakName], data), null, "\t");

				if (oldData === newDataJson) {
					// 配置未发生变化
					data = null;
				} else {
					// newDataJson存入data
					data = newDataJson;
				}
			}

			if (data) {
				// 写文件
				fs.outputFile(filePath, data, err => {
					if (!err) {
						console.log("Modified:\tUser/" + pakName + ".sublime-settings");
					} else {
						console.error("没有权限写入文件！请使用管理员权限运行！");
						process.exit(1);
					}
				});
			}
		});
	}

	for (var pakName in cfgs) {
		upCfg(pakName);
	}
}

// 要汉化的文案
var hanDate = {
	"About Sublime Text": "关于 Sublime Text",
	"About": "关于",
	"Absolute Path From Project Encoded": "项目绝对路径编码",
	"Absolute Path From Project": "项目绝对路径",
	"Add Alternate Remote Mapping": "添加备用远程映射",
	"Add Channel": "添加资源库链接",
	"Add Current File": "添加当前文件",
	"Add Exclude Filter": "添加排除筛选器",
	"Add Folder to Project": "添加文件夹到项目",
	"Add Folder": "添加目录",
	"Add Include Filter": "添加包含筛选器",
	"Add Next Line": "添加至后行",
	"Add Open Files": "添加打开的文件",
	"Add Open Folders": "添加打开的文件夹",
	"Add Previous Line": "添加至前行",
	"Add Repository": "添加资源库",
	"Advanced Install Package": "高级插件安装",
	"Automatic": "自动编译",
	"Back to Symbol Definition": "回到到符号定义",
	"Balance (inward)": "选中子节点",
	"Balance (outward)": "选中父节点",
	"Bookmarks": "书签",
	"Bracket Settings - Default": "括号设置 - 默认",
	"Bracket Settings - User": "括号设置 - 用户",
	"Browse Packages": "浏览插件",
	"Browse Remote": "浏览远程",
	"Browse Server": "浏览服务器",
	"Build Results": "编译结果",
	"Build System": "编译系统",
	"Build With": "用其编译",
	"Cancel Build": "取消编译",
	"Cancel Upload": "取消上传",
	"Changelog": "更新日志",
	"Check for Updates": "检查更新",
	"Chinese": "中文",
	"Choose Gutter Theme": "选择简报主题",
	"Clear All": "清除所有",
	"Clear Annotations": "清除批注",
	"Clear Caches": "清除缓存",
	"Clear Color Scheme Folder": "清除颜色方案文件夹",
	"Clear Items": "清除项目",
	"Clear Mark": "清除标记",
	"Clear": "清除",
	"Close All Files": "关闭所有文件",
	"Close All": "关闭所有",
	"Close File": "关闭文件",
	"Close Group": "关闭分组",
	"Close Other Tabs": "关闭其它",
	"Close Project": "关闭项目",
	"Close Tabs to the Right": "关闭右侧标签",
	"Close Window": "关闭窗口",
	"Close": "关闭",
	"Code Folding": "代码折叠",
	"Code Folding: Fold Tag Attributes": "折叠标签属性",
	"Code Folding: Unfold All": "展开所有",
	"Color Scheme": "配色方案",
	"Columns: 2": "列: 2 窗口",
	"Columns: 3": "列: 3 窗口",
	"Columns: 4": "列: 4 窗口",
	"Command Palette": "命令面板",
	"Command": "命令",
	"Comment": "注释",
	"Compact (Break Selectors No Spaces)": "紧凑 (选择符折行，无空格)",
	"Compact (Break Selectors)": "紧凑 (选择符折行)",
	"Compact (Break Selectors, No Spaces)": "紧凑 (选择符折行，无空格)",
	"Compact (No Spaces)": "紧凑 (无空格)",
	"Compact": "紧凑",
	"Compressed": "压缩",
	"Content as Data URI": "内容为 Data URI",
	"Content as UTF-8": "内容为 UTF-8",
	"Convert Case": "转换大小写",
	"Convert Case: Lower Case": "小写",
	"Convert Case: Swap Case": "交换大小写",
	"Convert Case: Title Case": "标题大小写",
	"Convert Case: Upper Case": "大写",
	"Convert Indentation to Spaces": "转换缩进为空格",
	"Convert Indentation to Tabs": "转换缩进为Tab",
	"Convert to Spaces": "将转换为空格",
	"Convert to Tabs": "转换成制表符",
	"Copy as Tag a": "复制为<a>标签",
	"Copy as Tag script": "复制为<script>标签",
	"Copy as Tag style": "复制为<style>标签",
	"Copy as Text": "复制为文本",
	"Copy Dir Path": "复制目录路径",
	"Copy File Path": "复制文件路径",
	"Copy Name Encoded": "复制文件名编码",
	"Copy Name": "复制名称",
	"Copy Path (Windows)": "复制路径 (Windows)",
	"Copy Path as URI": "复制路径为 URI",
	"Copy Path From Project Encoded": "复制相对项目路径编码",
	"Copy Path From Project": "复制相对项目路径",
	"Copy Path": "复制路径",
	"Copy to Clipboard": "复制到剪切板",
	"Copy URL": "复制 URL",
	"Copy": "复制",
	"copy": "复制",
	"Create Binary Package File": "创建二进制插件",
	"Create Linter Plugin": "创建分析插件",
	"Create Package File": "创建插件",
	"Cut": "剪切",
	"Debug + arguments": "调试 + 参数",
	"Debug Mode": "调试模式",
	"Debug": "调试",
	"Decorate line comment": "装饰行注释",
	"Decrement Number by 0.1": "递减0.1",
	"Decrement Number by 1": "递减1",
	"Decrement Number by 10": "递减10",
	"Default": "默认",
	"Delete File": "删除文件",
	"Delete Folder": "删除文件夹",
	"Delete Line": "删除行",
	"Delete Local and Remote Files": "删除本地和远程文件",
	"Delete Local and Remote Folders": "删除本地和远程文件夹",
	"Delete Remote File": "删除远程文件",
	"Delete Remote Folder": "删除远程文件夹",
	"Delete Server": "删除服务器",
	"Delete to Beginning": "删除到起始位置",
	"Delete to End": "删除直至结尾处",
	"Delete to Mark": "删除已标记",
	"Delete Word Backward": "向前删除单词",
	"Delete Word Forward": "向后删除单词",
	"Delete": "删除",
	"Dictionary": "词典",
	"Diff Files": "比较文件",
	"Diff Remote File": "远程文件差异",
	"Disable Debug Mode": "禁用调试模式",
	"Disable Linter": "禁用分析器",
	"Disable Linting": "禁用分析",
	"Disable Live Autocompletion for Current Language": "为当前语言禁用动态自动完成功能",
	"Disable Live Autocompletion": "禁用动态自动完成",
	"Disable Package": "禁用插件",
	"Disable Plugin": "禁用插件",
	"Discover Packages": "搜索插件",
	"Distraction Free - User": "无干扰模式 - 用户",
	"Documentation": "帮助文档",
	"Don't Make Warnings Passive": "不要被动警告",
	"Don’t Show Errors on Save": "在保存时不显示错误",
	"Download File": "下载文件",
	"Download Folder": "下载文件夹",
	"Dump Import Directories": "转储导入目录",
	"Duplicate": "重复",
	"Edit Applications": "编辑应用程序",
	"Edit Preview URLs": "编辑预览 URL",
	"Edit Project": "编辑项目",
	"Edit Remote Mapping": "编辑远程映射",
	"Edit Server": "编辑服务器",
	"Edit to Right": "在右侧编辑",
	"Edit": "编辑",
	"Empty": "空",
	"Enable Debug Mode": "开启调试模式",
	"Enable Linter": "开启语法分析器",
	"Enable Linting": "开启分析",
	"Enable Live Autocompletion for Current Language": "为当前语言启用动态自动完成功能",
	"Enable Live Autocompletion": "启用动态自动完成",
	"Enable Package": "启用插件",
	"Enable Plugin": "启用插件",
	"Encode Special Characters": "特殊字符进行编码",
	"Encode\\Decode Image to data:URL": "编码\\解码图片为data:URL",
	"Enter License": "输入许可证",
	"Evaluate Math Expression": "计算数学表达式的值",
	"Example Key Bindings": "按键绑定 - 示例",
	"Exit": "退出",
	"Expand Abbreviation": "展开缩写",
	"Expand Selection to Brackets": "扩展所选括号",
	"Expand Selection to Indentation": "扩展所选缩进",
	"Expand Selection to Line": "扩展选定的行",
	"Expand Selection to Paragraph": "扩展选定的段",
	"Expand Selection to Scope": "扩展所选段落",
	"Expand Selection to Tag": "扩展所选标签",
	"Expand Selection to Word": "扩展选定的词",
	"Expanded (Break Selectors)": "展开 (选择符折行)",
	"Expanded": "展开",
	"Export HTML in Sublime Text": "导出 HTML 到 Sublime Text",
	"File": "文件",
	"Filter Rules by Key": "由键筛选器规则",
	"Find & Replace": "查找与替换",
	"Find Advanced": "高级查找",
	"Find Files Named": "按文件名查找",
	"Find in Files": "在文件中查找",
	"Find in Folder": "在文件夹中查找",
	"Find Previous": "查找上一个",
	"Find Results": "查找结果",
	"Find": "查找",
	"Focus Group": "焦点分组",
	"Fold All": "折叠 所有",
	"Fold Bracket Content": "折叠括号内容",
	"Fold Level 2": "折叠 2 层",
	"Fold Level 3": "折叠 3 层",
	"Fold Level 4": "折叠 4 层",
	"Fold Level 5": "折叠 5 层",
	"Fold Level 6": "折叠 6 层",
	"Fold Level 7": "折叠 7 层",
	"Fold Level 8": "折叠 8 层",
	"Fold Level 9": "折叠 9 层",
	"Fold Tag Attributes": "折叠标签属性",
	"Font": "字体设置",
	"Go to Matching Pair": "跳转到匹配对",
	"Goto Anything": "转到任何",
	"Goto Definition": "转到定义",
	"Goto Line": "转到行",
	"Goto Symbol in Project": "转至项目中的符号",
	"Goto Symbol": "转到符号",
	"Goto": "转到",
	"Grab CA Certs": "获取 CA 证书",
	"Grid: 4": "网格: 4 画面",
	"Group 1": "分组 1",
	"Group 2": "分组 2",
	"Group 3": "分组 3",
	"Group 4": "分组 4",
	"Groups": "分组",
	"Guess Settings From Buffer": "猜测来自缓冲区的设置",
	"Help": "帮助",
	"Hexadecimal": "十六进制",
	"Hide From Sidebar (In theory exclude from project)": "从侧边栏隐藏 (理论上从项目中排除)",
	"In Parent Folder": "在父文件夹",
	"In Paths Containing": "在路径中包含",
	"In Project Folder": "在项目文件夹",
	"In Project Folders": "在全部项目文件夹",
	"In Project": "在项目",
	"Increment Number by 0.1": "递增0.1",
	"Increment Number by 1": "递增1",
	"Increment Number by 10": "递增10",
	"Incremental Find": "增量查找",
	"Indent Using Spaces": "使用空格缩进",
	"Indentation": "缩进",
	"Insert Line After": "插入至行后",
	"Insert Line Before": "插入至行前",
	"Install Local Dependency": "安装本地依赖项",
	"Install Package": "安装插件",
	"Install": "安装",
	"Jump Back": "向后跳转",
	"Jump Forward": "向前跳转",
	"Jump to Left Bracket": "跳转到左括号",
	"Jump to Matching Bracket": "跳转至匹配的括号",
	"Jump to Right Bracket": "跳转到右括号",
	"Jump to Symbol Definition": "跳转到符号定义",
	"Key Bindings - Default": "按键绑定 - 默认",
	"Key Bindings - Example": "按键绑定 - 示例",
	"Key Bindings - User": "按键绑定 - 用户",
	"Larger": "较大",
	"Layout": "窗口布局",
	"LICENSE": "许可证",
	"Line Down": "下移一行",
	"Line Endings": "行尾标识",
	"Line Up": "上移一行",
	"Line": "行",
	"Lint Code": "分析代码",
	"Lint Mode": "分析模式",
	"Lint This View": "分析此视图",
	"List Packages": "列出插件",
	"List Unmanaged Packages": "列出未托管插件",
	"List": "列表",
	"Locate": "定位",
	"Lower Case": "改为小写",
	"Mac OS 9 Line Endings (CR)": "Mac OS 9 换行符 (CR)",
	"Macros": "宏",
	"Make Warnings Passive": "被动警告",
	"Map to Remote": "映射到远程",
	"Mark Style": "标注风格",
	"Mark": "标记",
	"Mass Rename Selection": "批量重命名选中项",
	"Match Brackets (ignore threshold)": "匹配括号 (忽略阈值)",
	"Max Columns: 1": "最多1栏",
	"Max Columns: 2": "最多2栏",
	"Max Columns: 3": "最多3栏",
	"Max Columns: 4": "最多4栏",
	"Max Columns: 5": "最多5栏",
	"Merge Lines": "合并行",
	"Monitor File (Upload on External Save)": "监控文件 (外部保存时上传)",
	"Mouse Bindings - Default": "鼠标绑定 - 默认",
	"Mouse Bindings - Example": "鼠标绑定 - 示例",
	"Mouse Bindings - User": "鼠标绑定 - 用户",
	"Move File to Group": "将文件移至分组",
	"Move File To Group": "焦点分组",
	"Move File to New Group": "移动文件到新分组",
	"Move": "移动",
	"Name Encoded": "文件名编码",
	"New Build System": "新编译系统",
	"New File Relative to Current View": "相对当前视图新建文件",
	"New File Relative to Project Root": "相对项目根目录新建文件",
	"New File": "新建文件",
	"New Folder Relative to Current View": "相对当前视图新建文件夹",
	"New Folder Relative to Project Root": "相对项目根目录新建文件夹",
	"New Folder": "新建文件夹",
	"New Group": "新建分组",
	"New Plugin": "新插件",
	"New Snippet": "新代码片段",
	"New Syntax": "新建语法",
	"New View into File": "新标签中打开当前文件",
	"New Window": "新建窗口",
	"New Workspace for Project": "为项目新建工作区",
	"Next Edit Point": "下一个编辑点",
	"Next Error": "下一个错误",
	"Next File in Stack": "堆栈中的下一个文件",
	"Next File": "下一个文件",
	"Next": "下一个",
	"No Column Highlights Entire Line": "只标记整行，而非列",
	"No Column Highlights Line": "高亮线不分列",
	"No Column Only Marks Gutter": "只标记简报，而非列",
	"None": "无",
	"Open / Run": "打开/运行",
	"Open Containing Folder": "打开所在的文件夹",
	"Open File": "打开文件",
	"Open Folder": "打开文件夹",
	"Open In All Browsers": "在所有的浏览器中打开",
	"Open In Browser - Production Server": "在浏览器中打开 - 生产服务器",
	"Open In Browser - Testing Server": "在浏览器中打开 - 测试服务器",
	"Open in Browser": "在浏览器中打开",
	"Open In Browser": "在浏览器中打开",
	"Open In New Window": "在新窗口中打开",
	"Open Markdown Cheat sheet": "打开Markdown速查表",
	"Open Project": "打开项目",
	"Open Recent": "最近的项目",
	"Open Terminal Here": "在此处打开终端",
	"Open User Settings": "打开用户设置",
	"Open With Finder": "用Finder打开",
	"Open With": "打开方式",
	"Open": "打开",
	"OS Specific - User": "特定操作系统 - 用户",
	"Output Panel": "输出面板",
	"Package Control Settings - Default": "插件管理器设置 - 默认",
	"Package Control Settings - User": "插件管理器设置 - 用户",
	"Package Control": "插件控制器",
	"Package Settings": "插件设置",
	"Packages": "插件",
	"Paste from History": "从历史中粘贴",
	"Paste in Parent": "在父级粘贴",
	"paste": "粘贴",
	"Paste": "粘贴",
	"Path as URI": "作为 URI 的路径",
	"Path": "路径",
	"Permute Lines": "重排行序",
	"Permute Selections": "置换选定",
	"Playback Macro": "播放宏",
	"Plugin Development": "插件开发",
	"Preferences": "首选项",
	"Prettify Code": "代码美化",
	"Preview in Browser": "在浏览器中预览",
	"Previous Edit Point": "上一个编辑点",
	"Previous Error": "上一个错误",
	"Previous File in Stack": "堆栈中的上一个文件",
	"Previous File": "上一个文件",
	"Previous Result": "上一个结果",
	"Previous": "上一个",
	"Profile Events": "事件简报",
	"Project Folders": "项目文件夹",
	"Project": "项目",
	"Promote as Project Folder": "提升为项目文件夹",
	"Publish": "发布",
	"Quick Add Next": "快速选中下一个",
	"Quick Find All": "快速查找全部",
	"Quick Find": "快速查找",
	"Quick Skip Next": "快速跳转到下一个",
	"Quick Switch Project": "快速切换项目",
	"Quit": "退出",
	"README": "文档",
	"Recent Projects": "切换项目",
	"Reflect CSS Value": "映射CSS值",
	"Refresh Folders": "刷新文件夹",
	"Refresh": "刷新",
	"Reindent Lines": "重新缩进",
	"Relative Path From Project Encoded": "相对项目路径编码",
	"Relative Path From Project": "相对项目路径",
	"Relative Path From View Encoded": "相对视图路径编码",
	"Relative Path From View": "相对视图路径",
	"Reload Extensions": "重加载扩展",
	"Reload with Encoding": "按编码重新加载",
	"Remove all Folders from Project": "从项目中删除所有文件夹",
	"Remove Brackets": "删除括号",
	"Remove Channel": "删除通道",
	"Remove Folder from Project": "从项目中删除文件夹",
	"Remove Package": "删除插件",
	"Remove Repository": "删除资源库",
	"Remove Tag": "删除标签",
	"Rename Local and Remote Files": "重命名本地和远程文件",
	"Rename Local and Remote Folders": "重命名本地和远程文件夹",
	"Rename Tag": "重命名标签",
	"Rename": "重命名",
	"Reopen Closed File": "重新打开已关闭文件",
	"Reopen with Encoding": "重新打开编码",
	"Reparse comment block": "重解析块注释",
	"Replace": "替换",
	"Report (Open Files)": "报告 (打开文件)",
	"Reset": "重置",
	"Reveal in Side Bar": "在侧边栏中显示",
	"Reveal": "浏览",
	"Reverse": "反向",
	"Revert File": "还原文件",
	"Revert": "恢复",
	"Rot13 Selection": "Rot13 选定",
	"Rows: 2": "行: 2 窗口",
	"Rows: 3": "行: 3 窗口",
	"Ruler": "标尺",
	"Run + arguments": "运行 + 参数",
	"Run CSScomb": "运行 CSScomb",
	"Run": "运行",
	"Satisfy Dependencies": "满足依赖性",
	"Save All on Build": "保存所有编译",
	"Save All": "全部保存",
	"Save As": "另存为",
	"Save Macro": "保存宏",
	"Save Project As": "项目另存为",
	"Save to HTML": "保存为HTML",
	"Save with Encoding": "保存使用编码",
	"Save Workspace As": "工作区另存为",
	"Save": "保存",
	"Scroll to Selection": "滚动到选定内容",
	"Scroll": "滚动",
	"Search Files": "搜索文件",
	"Search": "搜索",
	"Select All": "选择所有",
	"Select Bracket Content with Brackets": "选择括号内容及括号",
	"Select Bracket Content": "选择括号内容",
	"Select Next Attribute (left)": "选择下一个属性 (左)",
	"Select Next Attribute (right)": "选择下一个属性 (右)",
	"Select Next Item": "选中下一项",
	"Select Next": "选择下一步",
	"Select Previous Item": "选中上一项",
	"Select Previous": "选择上一步",
	"Select Tag Name (closing and opening)": "选择标签名 (关闭和打开)",
	"Select to Mark": "选择已标记",
	"Selection": "选择",
	"Set `node` Path": "设置“node”路径",
	"Set Encoding": "设置编码",
	"Set File Encoding to": "设置文件编码为",
	"Set Keyboard Shortcuts": "设置键盘快捷方式",
	"Set Linting Preferences": "设置语法分析首选项",
	"Set Plugin Options": "设置插件选项",
	"Set Prettify Preferences": "设置美化首选项",
	"Settings - Default": "设置 - 默认",
	"Settings - More": "设置 - 更多",
	"Settings - Syntax Specific - User": "设置 - 特定语法 - 用户",
	"Settings - User": "设置 - 用户",
	"Setup Server": "安装服务器",
	"SFTP Key Bindings": "SFTP 按键绑定",
	"SFTP Settings": "SFTP 设置",
	"Show All Errors": "显示所有错误",
	"Show Build Results": "显示编译结果",
	"Show Completions": "显示完成",
	"Show Errors on Save": "在保存时显示错误",
	"Show Merged Rules": "显示合并的规则",
	"Show Panel": "显示面板",
	"Show Results Panel": "显示结果面板",
	"Show Unsaved Changes": "显示未保存的更改",
	"Shuffle": "无序",
	"Side Bar": "侧边栏",
	"Single": "单窗口",
	"Smaller": "较小",
	"Snippets": "代码片段",
	"Sort (Case Sensitive)": "排序 (区分大小写)",
	"Sort Lines (Case Sensitive)": "按行排序(区分大小写)",
	"Sort Lines": "按行排序",
	"Sort": "排序",
	"Spell Check": "拼写检查",
	"Split into Lines": "拆分成行",
	"Split\\Join Tag": "分隔\\合并标签",
	"SublimeLinter Key Bindings - Default": "SublimeLinter 按键绑定 - 默认",
	"SublimeLinter Key Bindings - User": "SublimeLinter 按键绑定 - 用户",
	"SublimeLinter Settings - Default": "SublimeLinter 设置 - 默认",
	"SublimeLinter Settings - User": "SublimeLinter 设置 - 用户",
	"Swap Brackets": "互换括号",
	"Swap Case": "互换大小写",
	"Swap Quotes": "互换引号",
	"Swap Settings - Default": "交换设置 - 默认",
	"Swap Settings - User": "交换设置 - 用户",
	"Swap with Mark": "互换标记",
	"Switch File": "切换文件",
	"Switch Header/Implementation": "切换文件头/执行",
	"Switch Project in Window": "最近的项目",
	"Switch Project": "切换项目",
	"Switch Remote Mapping": "切换远程映射",
	"Sync Both Directions": "双向同步",
	"Sync Local -> Remote": "同步本地 -> 远程",
	"Sync Remote -> Local": "同步远程 -> 本地",
	"Syntax Specific - User": "特定语法 - 用户",
	"Syntax": "语法",
	"Tab Width: 1": "标签宽度: 1",
	"Tab Width: 2": "标签宽度: 2",
	"Tab Width: 3": "标签宽度: 3",
	"Tab Width: 4": "标签宽度: 4",
	"Tab Width: 5": "标签宽度: 5",
	"Tab Width: 6": "标签宽度: 6",
	"Tab Width: 7": "标签宽度: 7",
	"Tab Width: 8": "标签宽度: 8",
	"Tag a": "<a>标签",
	"Tag img": "<img>标签",
	"Tag script": "<script>标签",
	"Tag Settings - Default": "标签设置 - 默认",
	"Tag Settings - User": "标签设置 - 用户",
	"Tag style": "样式标签",
	"Tag": "标签",
	"Tests": "测试",
	"Text": "文本",
	"Title Case": "首字母大写",
	"Toggle Block Comment": "开启/关闭段注释",
	"Toggle Comment": "开启/关闭行注释",
	"Toggle Global Enable": "切换全局启用",
	"Toggle High Visibility Mode": "切换高可见性模式",
	"Toggle Linter": "切换语法分析器",
	"Toggle Menu": "切换菜单",
	"Toggle Minimap": "切换地图",
	"Toggle Open Files in Side Bar": "切换在侧栏中打开的文件",
	"Toggle Side Bar": "切换侧栏",
	"Toggle Status Bar": "切换状态栏",
	"Toggle String Bracket Escape Mode": "切换括号内字符串超长隐藏模式",
	"Toggle Tabs": "切换选项卡",
	"Toggle": "切换",
	"Tools": "工具",
	"Twitter": "推特",
	"Undo Selection": "撤销选择",
	"Unfold All": "展开全部",
	"Uninstall": "卸载",
	"Unique": "唯一",
	"Unix Line Endings (LF)": "Unix 换行符 (LF)",
	"Update Image Size": "更新图像大小",
	"Update": "更新",
	"Upgrade Package": "升级插件",
	"Upgrade/Overwrite All Packages": "升级/覆盖所有插件",
	"Upload File": "上传文件",
	"Upload Folder": "上传文件夹",
	"Upload Open Files": "上传打开的文件",
	"Upper Case": "改为大写",
	"URL Decoded": "URL 解码",
	"URL": "URL",
	"Use Selection for Find": "在所选内容中查找",
	"Use Selection for Replace": "在所选内容中替换",
	"UTF-16 BE with BOM": "UTF-16BE 包含BOM",
	"UTF-16 LE with BOM": "UTF-16 LE 包含BOM",
	"UTF-8 with BOM": "UTF-8 包含BOM",
	"View README in Github": "在Github上阅读文档",
	"View": "视图",
	"Windows Line Endings (CRLF)": "Windows 换行符 (CRLF)",
	"Word Wrap Column": "自动换行列",
	"Word Wrap": "单词换行",
	"Wrap paragraph at 100 characters": "换行段落为 100 个字符",
	"Wrap paragraph at 120 characters": "换行段落为 120 个字符",
	"Wrap paragraph at 70 characters": "换行段落为  70 个字符",
	"Wrap paragraph at 78 characters": "换行段落为  78 个字符",
	"Wrap paragraph at 80 characters": "换行段落为  80 个字符",
	"Wrap Paragraph at Ruler": "换行段落标尺",
	"Wrap Selection With Tag": "包含所选内容的标签",
	"Wrap Selections with Brackets": "用括号包裹选中区域",
	"Wrap Settings - Default": "包裹设置 - 默认",
	"Wrap Settings - User": "包裹设置 - 用户",
	"Wrap With Abbreviation": "用缩写包裹",
	"Wrap": "自动换行",
};

// 数据中无英文文案则按功能翻译
var commandHan = {
	"build": "立即编译",
	"clear_bookmarks": "清除书签",
	"close_project": "关闭项目",
	"close_tag": "关闭当前标签",
	"copy": "复制",
	"cut": "剪切",
	"duplicate_line": "复制光标所在行，插入在该行之前",
	"exit": "退出",
	"find_next": "查找下一个",
	"fold": "折叠",
	"indent": "缩进",
	"invert_selection": "反向选择",
	"join_lines": "合并行",
	"next_bookmark": "下一个书签",
	"next_misspelling": "下一个拼写错误",
	"next_result": "下一个结果",
	"open_context_url": "打开上下文url",
	"paste": "粘贴",
	"paste_and_indent": "粘贴并缩进",
	"prev_bookmark": "上一个书签",
	"prev_misspelling": "上一个拼写错误",
	"purchase_license": "购买许可证",
	"redo_or_repeat": "重做",
	"reindent": "重新缩进",
	"remove_license": "删除许可证",
	"replace_next": "替换下一个",
	"select_all": "全选",
	"select_all_bookmarks": "选择所有书签",
	"set_build_system": "设置译系统",
	"set_mark": "设置标记",
	"show_panel": "显示/隐藏控制台",
	"single_selection": "单独选择",
	"soft_redo": "软重做",
	"soft_undo": "软撤销",
	"swap_line_down": "向下移动当前行",
	"swap_line_up": "向上移动当前行",
	"toggle_bookmark": "开启/关闭书签",
	"toggle_distraction_free": "进入/退出无干扰模式",
	"toggle_full_screen": "进入/退出全屏显示",
	"toggle_menu": "显示/隐藏菜单栏",
	"toggle_minimap": "显示/隐藏缩略图",
	"toggle_record_macro": "录制宏",
	"toggle_show_open_files": "显示打开的文件",
	"toggle_side_bar": "显示/隐藏侧边栏",
	"toggle_status_bar": "显示/隐藏状态栏",
	"toggle_tabs": "显示/隐藏标签页",
	"transpose": "词互换",
	"undo": "撤销",
	"unfold": "展开",
	"unindent": "取消缩进",
	"yank": "抽出",
	sublimelinter_choose_lint_mode: {
		"Background": "后台",
		"Load/save": "加载/保存",
		"Manual": "手动",
		"Save only": "仅保存",
	},
	sublimelinter_choose_mark_style: {
		"Fill": "填充",
		"Outline": "边框线",
		"Solid underline": "实线下划线",
		"Squiggly underline": "波浪下划线",
		"Stippled underline": "点画下划线",
		"None": "无"
	},
};


// 数据中无英文文案则按功能翻译
var langHan = {
	"Arabic": "阿拉伯文",
	"Baltic": "波罗的海文",
	"Celtic": "凯尔特文",
	"Central European": "中欧",
	"Chinese Simplified": "简体中文",
	"Chinese Traditional": "繁体中文",
	"Cyrillic": "西里尔文",
	"Estonian": "爱沙尼亚文",
	"Greek": "希腊文",
	"Hebrew": "希伯来文",
	"Japanese": "日文",
	"Korean": "韩文",
	"Nordic European": "北欧文",
	"Nordic": "北欧文",
	"Romanian": "罗马尼亚语文",
	"Thai": "泰文",
	"Turkish": "土耳其文",
	"Vietnamese": "越南文",
	"Western European": "西欧",
	"Western": "西欧",
};

/**
 * 深度遍历对象进行汉化
 */
function fixObj(obj, skip) {
	if (Array.isArray(obj)) {
		var hasDonate;
		obj = obj.filter((subObj) => {
			if (subObj.caption === "Donate") {
				// 删除“捐助”
				hasDonate = true;
				return false;
			} else if (hasDonate && subObj.caption === "-") {
				// 删除“捐助”后再删除一项分隔符
				hasDonate = false;
				return false;
			} else {
				// 汉化数组项
				fixObj(subObj, skip);
				return true;
			}
		});
	} else if (obj && typeof obj === "object") {
		if (skip && obj.id) {
			// 如果是第三方插件的一级菜单
			delete obj.caption;
			delete obj.mnemonic;
			if (obj.id === "preferences" && Array.isArray(obj.children)) {
				obj.children.forEach((subObj) => {
					if (subObj.id === "package-settings") {
						delete subObj.caption;
						delete subObj.mnemonic;
					}
				});
			}
		} else {
			// 如果是Sublime本身或Package Control的一级菜单，或者子项目

			var caption = /^(.*?)(…)?$/.exec(obj.caption);
			var hanCaption = "";
			if (caption && caption[1]) {
				var prefixCaption = /^([^:]+)\:\s*(.+)$/.exec(caption[1]);
				if (prefixCaption && hanDate[prefixCaption[2]]) {
					hanCaption = caption[1] + " → " + (hanDate[prefixCaption[1]] || prefixCaption[1]) + ": " + hanDate[prefixCaption[2]];
				} else if (hanDate[caption[1]]) {
					// 普通文案翻译
					hanCaption = hanDate[caption[1]];
				} else if (obj.args && obj.args.encoding) {
					// 语言名称翻译
					hanCaption = caption[1].replace(/^([A-Z]+\w+(?:\s+[A-Z]+\w+)*)(\s\(.*?\))$/, (s, langName, code) => {
						if (langHan[langName]) {
							return langHan[langName] + code;
						} else {
							return s;
						}
					});
				}
			}
			if (!hanCaption && obj.command && commandHan[obj.command]) {
				// 按命令翻译
				hanCaption = commandHan[obj.command];
				if (typeof hanCaption === "object" && obj.args) {
					for (var key in obj.args) {
						break;
					}
					hanCaption = hanCaption[obj.args[key]];
				}
			}

			if (hanCaption) {
				if (obj.mnemonic && !(new RegExp(obj.mnemonic).test(hanCaption))) {
					var mnemonic = obj.mnemonic.toUpperCase();
					hanCaption += "(" + mnemonic + ")";
					obj.mnemonic = mnemonic;
				}
				if (caption[2]) {
					hanCaption += caption[2];
				}
				obj.caption = hanCaption;
			}
		}
		for (var i in obj) {
			obj[i] = fixObj(obj[i]);
		}
	}
	return obj;
}

// 文件数据写入
function hanJsonFile(data, subPath, isReplace) {
	var filePath = path.join(dirPackages, subPath);

	// 统一特殊字符
	data = data.replace(/–/g, "-").replace(/(['"])(.*?)\.\.\.\1/g, "$1$2…$1");

	try {
		data = JSON.parse(data);
	} catch (ex) {
		try {
			data = eval.call(null, "(" + data + ")");
		} catch (ex) {
			if (!isReplace) {
				data = data.replace(/(\$\w+)/g, "'`$1`'");
				return hanJsonFile(data, subPath, true);
			}
		}
	}
	if (data) {
		fileCache[filePath] = true;
		var oldDataJson = JSON.stringify(data, null, "\t");

		var newDataJson = JSON.stringify(fixObj(data, /\bMain.sublime-menu(?:\.\w+)?$/.test(subPath) && !/^(?:Default|Package\s+Control)\b/.test(subPath), subPath), null, "\t");
		if (oldDataJson === newDataJson) {

			// 数据未汉化，不写文件
			console.log("ok:\t" + subPath);

		} else {

			if (isReplace) {
				newDataJson = newDataJson.replace(/"`(\$\w+)`"/, "$1");
			}

			// 数据汉化，写文件
			fs.outputFile(filePath, newDataJson, err => {
				if (!err) {
					console.log("Modified:\t" + subPath);
				} else {
					console.log(err);
				}
			});
		}
	}
}

var reExt = /\w+\.sublime-(?:menu|commands)(?:\.\w+)?$/;

/**
 * 查找各插件压缩包自带的*.sublime-menu、*.sublime-menucommands
 */
function unzip(dir) {
	dir = path.resolve(dirRoot, dir);
	if (fs.existsSync(dir)) {
		fs.readdirSync(dir).forEach((item) => {
			var zipFile;
			try {
				zipFile = new AdmZip(path.join(dir, item));
			} catch (ex) {

			}
			if (zipFile) {
				zipFile.getEntries().forEach((zipEntry) => {
					if (reExt.test(zipEntry.entryName)) {
						hanJsonFile(zipFile.readAsText(zipEntry.entryName), item.replace(/\.[^\.]+$/, "/" + zipEntry.entryName));
					}
				});
			}
		});
	}
}

function init() {
	dirPackages = path.join(dirData, "Packages");
	// Sublime Text 3/Packages
	unzip("Packages");
	// Sublime Text 2/Pristine Packages
	unzip("Pristine Packages");
	// ./Data/Pristine Packages
	unzip(path.join(dirData, "Pristine Packages"));
	// ./Data/Installed Packages
	unzip(path.join(dirData, "Installed Packages"));

	// 查找./Data/Data/Packages各插件文件夹自带的*.sublime-menu、*.sublime-menucommands
	fs.readdir(dirPackages, (err, dirs) => {
		if (!err) {
			dirs.forEach((dir) => {
				dir = path.join(dirPackages, dir);
				fs.readdir(dir, (err, files) => {
					if (!err) {
						files.forEach((file) => {
							if (reExt.test(file) && !fileCache[file = path.join(dir, file)]) {
								fs.readFile(file, (err, data) => {
									if (!err) {
										hanJsonFile(data.toString(), path.relative(dirPackages, file));
									}
								});
							}
						});
					}
				});
			});
		}
	});
}

fs.access(path.join(__dirname, "sublime_text" + (process.platform === "win32" ? ".exe" : "")), fs.F_OK, err => {
	if (err) {
		switch (process.platform) {
			case "win32":
				dirRoot = path.join(process.env.ProgramFiles, "Sublime Text 3");
				break;
			case "linux":
				dirRoot = "/opt/sublime_text";
				break;
			case "darwin":
				dirRoot = "/Applications/Sublime Text.app/Contents/MacOS";
		}
	} else {
		dirRoot = __dirname;
	}

	dirData = (function() {
		try {
			fs.accessSync("Data");
			return path.resolve("Data");
		} catch (ex) {

		}
		switch (process.platform) {
			case "win32":
				dirData = path.join(process.env.APPDATA, "Sublime Text ");
				break;
			case "linux":
				dirData = path.join(process.env.HOME, ".config/sublime-text-");
				break;
			case "darwin":
				dirData = path.join(process.env.HOME, "Library/Application Support/Sublime Text ");
		}

		try {
			fs.accessSync(dirData + 3);
			return dirData + 3;
		} catch (ex) {

		}
		try {
			fs.accessSync(dirData + 2);
			return dirData + 2;
		} catch (ex) {

		}

		console.error("sublime未找到,请安装sublime后至少运行一次");
	})();

	if (dirData) {
		init();
		outputLicense(3);
		outputLicense(2);
		contextMenu();
		installPackage();
		settings();
	}
});
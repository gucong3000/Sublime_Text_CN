/*jshint node: true */
"use strict";
var fs = require("fs-extra") || require("fs"),
	AdmZip = require("adm-zip"),
	path = require("path");

if (!fs.outputFile) {
	fs.outputFile = fs.writeFile;
}

// 要汉化的文案
var hanDate = {
	"100": "100 个字符宽度",
	"120": "120 个字符宽度",
	"70": " 70  个字符宽度",
	"78": " 78  个字符宽度",
	"80": " 80  个字符宽度",
	"About Sublime Text 2": "关于 Sublime Text 2",
	"About Sublime Text": "关于 Sublime Text",
	"About": "关于",
	"Add Current File": "添加当前文件",
	"Add Exclude Filter": "添加排除筛选器",
	"Add Folder to Project…": "添加文件夹到项目…",
	"Add Folder": "添加目录",
	"Add Include Filter": "添加包含筛选器",
	"Add Next Line": "添加至后行",
	"Add Open Files": "添加打开的文件",
	"Add Open Folders": "添加打开的文件夹",
	"Add Previous Line": "添加至前行",
	"Arabic": "阿拉伯语 ",
	"Automatic": "自动编译",
	"Baltic": "波罗海语 ",
	"Bookmarks": "书签",
	"Bookmarks: Clear All": "Bookmarks: Clear All→书签: 清除所有",
	"Bookmarks: Select All": "Bookmarks: Select All→书签: 选择所有",
	"Bookmarks: Select Next": "Bookmarks: Select Next→书签: 选择下一步",
	"Bookmarks: Select Previous": "Bookmarks: Select Previous→书签: 选择以前",
	"Bookmarks: Toggle": "Bookmarks: Toggle→书签: 切换",
	"Browse Packages…": "浏览插件",
	"Build Results": "编译结果",
	"Build System": "编译系统",
	"Build With…": "运行",
	"Cancel Build": "取消编译",
	"Celtic": "凯尔特语 ",
	"Central European (ISO 8859-2)": "中欧语 (ISO 8859-2)",
	"Central European (Windows 1250)": "中欧语 (Windows 1250)",
	"Changelog": "更新日志",
	"Changelog…": "更新日志…",
	"Check for Updates…": "检查更新…",
	"Chinese": "中文",
	"Clear Annotations": "清除批注",
	"Clear Items": "清除项目",
	"Clear": "清除",
	"ClearMark": "清除标记",
	"Close All Files": "关闭所有文件",
	"Close File": "关闭文件",
	"Close Group": "关闭分组",
	"Close Other Tabs": "关闭其它",
	"Close Project": "关闭项目",
	"Close Tabs to the Right": "关闭右侧标签",
	"Close Window": "关闭窗口",
	"Close": "关闭",
	"Code Folding": "代码折叠",
	"Code Folding: Fold Tag Attributes": "Code Folding: Fold Tag Attributes→代码折叠: 折叠标签属性",
	"Code Folding: Unfold All": "Code Folding: Unfold All→代码折叠: 展开所有",
	"Color Scheme": "配色方案",
	"Columns: 2": "列: 2 窗口",
	"Columns: 3": "列: 3 窗口",
	"Columns: 4": "列: 4 窗口",
	"Command Palette…": "命令面板…",
	"Comment": "注释",
	"Compact (Break Selectors)": "紧凑 (选择符折行)",
	"Compact (Break Selectors, No Spaces)": "紧凑 (选择符折行，无空格)",
	"Compact (No Spaces)": "紧凑 (无空格)",
	"Compact": "紧凑",
	"Compressed": "压缩",
	"Convert Case": "转换大小写",
	"Convert Case: Lower Case": "Convert Case: Lower Case→转换案例: 小写",
	"Convert Case: Swap Case": "Convert Case: Swap Case→转换案例: 交换案例",
	"Convert Case: Title Case": "Convert Case: Title Case→转换案例: 标题案例",
	"Convert Case: Upper Case": "Convert Case: Upper Case→转换案例: 大写",
	"Convert Indentation to Spaces": "转换缩进为空格",
	"Convert Indentation to Tabs": "转换缩进为Tab",
	"Copy File Path": "复制文件路径",
	"Copy": "复制",
	"copy": "复制",
	"Cut": "剪切",
	"Cyrillic": "西里尔语 ",
	"Delete File": "删除文件",
	"Delete Folder": "删除文件夹",
	"Delete Line": "删除行",
	"Delete to Beginning": "删除到起始位置",
	"Delete to End": "删除直至结尾处",
	"Delete to Mark": "删除已标记",
	"Delete Word Backward": "向前删除单词",
	"Delete Word Forward": "向后删除单词",
	"Dictionary": "词典",
	"Diff Files…": "比较文件…",
	"Distraction Free – User": "无干扰模式 – 用户",
	"Documentation": "帮助文档",
	"Edit Project": "编辑项目",
	"Edit": "编辑",
	"Enter License": "输入许可证",
	"Estonian": "爱沙尼亚语 ",
	"Exit": "退出",
	"Expand Selection to Brackets": "扩展所选括号",
	"Expand Selection to Indentation": "扩展所选缩进",
	"Expand Selection to Line": "扩展选定的行",
	"Expand Selection to Paragraph": "扩展选定的段",
	"Expand Selection to Scope": "扩展所选段落",
	"Expand Selection to Tag": "扩展所选标签",
	"Expand Selection to Word": "扩展选定的词",
	"Expanded (Break Selectors)": "展开 (选择符折行)",
	"Expanded": "展开",
	"File": "文件",
	"File: Close All": "File: Close All→文件: 关闭所有",
	"File: New View into File": "File: New View into File→文件: 新的视图到文件",
	"File: Revert": "File: Revert→文件: 恢复",
	"File: Save All": "File: Save All→文件: 保存所有",
	"Find in Files…": "在文件中查找…",
	"Find in Folder…": "在文件夹中查找…",
	"Find Previous": "查找上一个",
	"Find Results": "查找结果",
	"Find": "查找",
	"Find…": "查找…",
	"Focus Group": "焦点分组",
	"Fold All": "折叠 所有",
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
	"Goto Anything…": "转到任何…",
	"Goto Definition": "转到定义",
	"Goto Definition…": "转到定义…",
	"Goto Line…": "转到行…",
	"Goto Symbol in Project…": "转至项目中的符号…",
	"Goto Symbol…": "转到符号…",
	"Goto": "转到",
	"Greek": "希腊语 ",
	"Grid: 4": "网格: 4 画面",
	"Group 1": "分组 1",
	"Group 2": "分组 2",
	"Group 3": "分组 3",
	"Group 4": "分组 4",
	"Groups": "分组",
	"Guess Settings From Buffer": "猜测来自缓冲区的设置",
	"Hebrew": "希伯来语 ",
	"Help": "帮助",
	"Hexadecimal": "十六进制",
	"HTML: Encode Special Characters": "HTML: Encode Special Characters→HTML: 特殊字符进行编码",
	"HTML: Wrap Selection With Tag": "HTML: Wrap Selection With Tag→HTML: 环绕选定内容与标记",
	"Incremental Find": "渐进式查找",
	"Indent Using Spaces": "使用空格缩进",
	"Indentation": "缩进",
	"Indentation: Convert to Spaces": "Indentation: Convert to Spaces→缩进: 将转换为空格",
	"Indentation: Convert to Tabs": "Indentation: Convert to Tabs→缩进: 转换成制表符",
	"Indentation: Reindent Lines": "Indentation: Reindent Lines→缩进: Reindent 线",
	"Insert Line After": "插入至行后",
	"Insert Line Before": "插入至行前",
	"Japanese": "日语 ",
	"Jump Back": "向后跳转",
	"Jump Forward": "向前跳转",
	"Jump to Matching Bracket": "跳转至匹配的括号",
	"Key Bindings – Default": "按键绑定 – 默认",
	"Key Bindings – Example": "按键绑定 – 示例",
	"Key Bindings – User": "按键绑定 – 用户",
	"Korean": "韩语 ",
	"Larger": "较大",
	"Layout": "窗口布局",
	"Line Down": "下移一行",
	"Line Endings": "行尾标识",
	"Line Up": "上移一行",
	"Line": "行",
	"Lint Code": "效验代码",
	"Lower Case": "改为小写",
	"Mac OS 9 Line Endings (CR)": "Mac OS 9 换行符 (CR)",
	"Macros": "宏",
	"Mark": "标记",
	"Max Columns: 1": "最多1栏",
	"Max Columns: 2": "最多2栏",
	"Max Columns: 3": "最多3栏",
	"Max Columns: 4": "最多4栏",
	"Max Columns: 5": "最多5栏",
	"Move File to Group": "将文件移至分组",
	"Move File To Group": "焦点分组",
	"Move File to New Group": "移动文件到新分组",
	"New Build System…": "新编译系统…",
	"New File": "新建文件",
	"New Folder…": "新建文件夹…",
	"New Group": "新建分组",
	"New Plugin…": "新插件…",
	"New Snippet…": "新代码片段…",
	"New View into File": "新标签中打开当前文件",
	"New Window": "新建窗口",
	"New Workspace for Project": "工作区切换项目",
	"Next File in Stack": "堆栈中的下一个文件",
	"Next File": "下一个文件",
	"Next": "下一个",
	"None": "无",
	"Nordic": "北欧语 ",
	"Open Containing Folder…": "打开所在的文件夹…",
	"Open File": "打开文件",
	"Open File…": "打开文件…",
	"Open Folder…": "打开文件夹…",
	"Open in Browser": "在浏览器中打开",
	"Open Project…": "打开项目…",
	"Open Recent": "最近的项目",
	"Open…": "打开…",
	"Package Control": "插件控制",
	"Package Control: Add Channel": "Package Control: Add Channel→添加资源库链接",
	"Package Control: Add Repository": "Package Control: Add Repository→添加资源库",
	"Package Control: Advanced Install Package": "Package Control: Advanced Install Package→高级插件安装",
	"Package Control: Create Binary Package File": "Package Control: Create Binary Package File→创建二进制插件",
	"Package Control: Create Package File": "Package Control: Create Package File→创建插件",
	"Package Control: Disable Package": "Package Control: Disable Package→禁用插件",
	"Package Control: Discover Packages": "Package Control: Discover Packages→搜索插件",
	"Package Control: Enable Package": "Package Control: Enable Package→启用插件",
	"Package Control: Grab CA Certs": "Package Control: Grab CA Certs→获取 CA 证书",
	"Package Control: Install Package": "Package Control: Install Package→安装插件",
	"Package Control: List Packages": "Package Control: List Packages→列出插件",
	"Package Control: List Unmanaged Packages": "Package Control: List Unmanaged Packages→列出未托管插件",
	"Package Control: Remove Channel": "Package Control: Remove Channel→删除通道",
	"Package Control: Remove Package": "Package Control: Remove Package→删除插件",
	"Package Control: Remove Repository": "Package Control: Remove Repository→删除资源库",
	"Package Control: Satisfy Dependencies": "Package Control: Satisfy Dependencies→满足依赖性",
	"Package Control: Upgrade Package": "Package Control: Upgrade Package→升级插件",
	"Package Control: Upgrade/Overwrite All Packages": "Package Control: Upgrade/Overwrite All Packages→升级/覆盖所有插件",
	"Package Settings": "插件设置",
	"Paste from History": "从历史中粘贴",
	"paste": "粘贴",
	"Permute Lines": "重新排列行序",
	"Permute Lines: Reverse": "Permute Lines: Reverse→置换行: 反向",
	"Permute Lines: Shuffle": "Permute Lines: Shuffle→置换行: 洗牌",
	"Permute Lines: Unique": "Permute Lines: Unique→置换行: 独特",
	"Permute Selections": "重新排列选择",
	"Permute Selections: Reverse": "Permute Selections: Reverse→排列选择: 反向",
	"Permute Selections: Shuffle": "Permute Selections: Shuffle→排列选择: 洗牌",
	"Permute Selections: Sort (Case Sensitive)": "Permute Selections: Sort (Case Sensitive)→排列选择: 排序 (区分大小写)",
	"Permute Selections: Sort": "Permute Selections: Sort→排列选择: 排序",
	"Permute Selections: Unique": "Permute Selections: Unique→排列选择: 独特",
	"Playback Macro": "播放宏",
	"Preferences": "首选项",
	"Preferences: Browse Packages": "Preferences: Browse Packages→首选项: 浏览程序包",
	"Preferences: Key Bindings - Default": "Preferences: Key Bindings - Default→首选项: 键绑定的默认值",
	"Preferences: Key Bindings - User": "Preferences: Key Bindings - User→首选项: 键绑定-用户",
	"Preferences: Package Control Settings – Default": "Preferences: Package Control Settings – Default→插件设置 – 默认",
	"Preferences: Package Control Settings – User": "Preferences: Package Control Settings – User→插件设置 – 用户",
	"Preferences: Settings - Default": "Preferences: Settings - Default→首选项: 设置-默认值",
	"Preferences: Settings - User": "Preferences: Settings - User→首选项: 设置 — 用户",
	"Prettify Code": "代码美化",
	"Previous File in Stack": "堆栈中的上一个文件",
	"Previous File": "上一个文件",
	"Previous Result": "上一个结果",
	"Previous": "上一个",
	"Project": "项目",
	"Project: Add Folder": "Project: Add Folder→项目: 添加文件夹",
	"Project: Close": "Project: Close→项目: 密切",
	"Project: Edit Project": "Project: Edit Project→项目: 编辑项目",
	"Project: Refresh Folders": "Project: Refresh Folders→项目: 刷新文件夹",
	"Project: Save As": "Project: Save As→项目: 将另存为",
	"Quick Add Next": "快速选中下一个",
	"Quick Find All": "快速查找全部",
	"Quick Find": "快速查找",
	"Quick Skip Next": "快速跳转到下一个",
	"Quick Switch Project…": "快速切换项目…",
	"README": "文档",
	"Recent Projects": "切换项目…",
	"Refresh Folders": "刷新文件夹",
	"Reload with Encoding": "按编码重新加载",
	"Remove all Folders from Project": "从项目中删除所有文件夹",
	"Remove Folder from Project": "从项目中删除文件夹",
	"Rename…": "重命名…",
	"Reopen Closed File": "重新打开已关闭文件",
	"Reopen with Encoding": "重新打开编码",
	"Replace…": "替换…",
	"Reset": "重置",
	"Reveal in Side Bar": "在侧边栏中显示",
	"Reverse": "反向",
	"Revert File": "还原文件",
	"Romanian": "罗马尼亚语 ",
	"Rot13 Selection": "Rot13 Selection→Rot13 选定",
	"Rows: 2": "行: 2 窗口",
	"Rows: 3": "行: 3 窗口",
	"Ruler": "标尺",
	"Save All on Build": "保存所有编译",
	"Save All": "全部保存",
	"Save As…": "另存为…",
	"Save Macro…": "保存宏…",
	"Save Project As…": "项目另存为…",
	"Save with Encoding": "保存使用编码",
	"Save Workspace As…": "工作区另存为…",
	"Save": "保存",
	"Scroll to Selection": "滚动到选定内容",
	"Scroll": "滚动",
	"Select to Mark": "选择已标记",
	"Selection": "选择",
	"Set `node` Path": "设置“node”路径",
	"Set Encoding": "设置编码",
	"Set File Encoding to": "设置文件编码为",
	"Set Keyboard Shortcuts": "设置键盘快捷方式",
	"Set Linting Preferences": "设置效验首选项",
	"Set Plugin Options": "设置插件选项",
	"Set Prettify Preferences": "设置美化首选项",
	"Settings - Default": "设置 – 默认",
	"Settings - User": "设置 – 用户",
	"Settings – Default": "设置 – 默认",
	"Settings – More": "设置 – 更多",
	"Settings – User": "设置 – 用户",
	"Show Build Results": "显示编译结果",
	"Show Completions": "显示完成",
	"Show Results Panel": "显示查找结果",
	"Show Unsaved Changes…": "显示未保存的更改…",
	"Shuffle": "无序",
	"Side Bar": "侧边栏",
	"Simplified": "-简体 ",
	"Single": "单窗口",
	"Smaller": "较小",
	"Snippets…": "代码片段…",
	"Sort (Case Sensitive)": "排序(区分大小写)",
	"Sort Lines (Case Sensitive)": "按行排序(区分大小写)",
	"Sort Lines": "按行排序",
	"Sort": "排序",
	"Spell Check": "拼写检查",
	"Split into Lines": "拆分成行",
	"Swap Case": "互换大小写",
	"Swap with Mark": "互换标记",
	"Switch File": "切换文件",
	"Switch Header/Implementation": "切换文件头/执行",
	"Switch Project in Window…": "最近的项目",
	"Switch Project…": "切换项目…",
	"Syntax Specific – User": "特定语法 – 用户",
	"Syntax": "语法",
	"Tab Width: 1": "标签宽度: 1",
	"Tab Width: 2": "标签宽度: 2",
	"Tab Width: 3": "标签宽度: 3",
	"Tab Width: 4": "标签宽度: 4",
	"Tab Width: 5": "标签宽度: 5",
	"Tab Width: 6": "标签宽度: 6",
	"Tab Width: 7": "标签宽度: 7",
	"Tab Width: 8": "标签宽度: 8",
	"Tag": "标签",
	"Text": "文本",
	"Title Case": "首字母大写",
	"Toggle Block Comment": "开启/关闭段注释",
	"Toggle Comment": "开启/关闭行注释",
	"Tools": "工具",
	"Traditional": "-繁体 ",
	"Turkish": "土耳其语 ",
	"Twitter": "推特",
	"Undo Selection": "撤销选择",
	"Unfold All": "展开全部",
	"Unique": "唯一",
	"Unix Line Endings (LF)": "Unix 换行符 (LF)",
	"Upper Case": "改为大写",
	"Use Selection for Find": "在所选内容中查找",
	"Use Selection for Replace": "在所选内容中替换",
	"UTF-16 BE with BOM": "UTF-16BE 包含BOM",
	"UTF-16 LE with BOM": "UTF-16 LE 包含BOM",
	"UTF-8 with BOM": "UTF-8 包含BOM",
	"Vietnamese": "越南语 ",
	"View README in Github": "在Github上阅读文档",
	"View": "查看",
	"View: Toggle Menu": "View: Toggle Menu→视图: 切换菜单",
	"View: Toggle Minimap": "View: Toggle Minimap→视图: 切换地图",
	"View: Toggle Open Files in Side Bar": "View: Toggle Open Files in Side Bar→视图: 切换在侧栏中打开的文件",
	"View: Toggle Side Bar": "View: Toggle Side Bar→视图: 切换侧栏",
	"View: Toggle Status Bar": "View: Toggle Status Bar→视图: 切换状态栏",
	"View: Toggle Tabs": "View: Toggle Tabs→视图: 切换选项卡",
	"Western": "西方语 ",
	"Windows Line Endings (CRLF)": "Windows 换行符 (CRLF)",
	"Word Wrap Column": "自动换行列",
	"Word Wrap": "自动换行",
	"Word Wrap: Toggle": "Word Wrap: Toggle→单词换行: 切换",
	"Wrap paragraph at 100 characters": "换行段落为 100 个字符",
	"Wrap paragraph at 120 characters": "换行段落为 120 个字符",
	"Wrap paragraph at 70 characters": "换行段落为  70 个字符",
	"Wrap paragraph at 78 characters": "换行段落为  78 个字符",
	"Wrap paragraph at 80 characters": "换行段落为  80 个字符",
	"Wrap Paragraph at Ruler": "换行段落标尺",
	"Wrap Selection With Tag": "包含所选内容的标签",
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
	"set_build_system": "新编译系统…",
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
};

/**
 * 深度遍历对象进行汉化
 */
function fixObj(obj) {
	if (Array.isArray(obj)) {
		obj.forEach(fixObj);
	} else if (typeof obj === "object") {
		var hanCaption = "";
		if (obj.caption && hanDate[obj.caption]) {
			hanCaption = hanDate[obj.caption];
		} else if (obj.command && commandHan[obj.command]) {
			hanCaption = commandHan[obj.command];
		}
		if (hanCaption) {
			if (obj.mnemonic) {
				hanCaption = hanCaption.replace(/(…?)$/, "(" + obj.mnemonic.toUpperCase() + ")$1");
			}
			obj.caption = hanCaption;
		}
		for (var i in obj) {
			fixObj(obj[i]);
		}
	}
	return obj;
}

// 文件数据写入
function hanJsonFile(data, filePath) {
	filePath = path.normalize(filePath);
	try {
		data = JSON.parse(data);
	} catch (ex) {
		try {
			data = eval.call(null, "(" + data + ")");
		} catch (ex) {

		}
	}
	if (data) {
		var oldDataJson = JSON.stringify(data, null, '\t');

		var newDataJson = JSON.stringify(fixObj(data), null, '\t');
		if (oldDataJson !== newDataJson) {

			fs.outputFile(filePath, newDataJson, function(err) {
				if (!err) {
					console.log("Modified:\t" + filePath);
				} else {
					console.log(err);
				}
			});
		} else {
			console.log("ok:\t" + filePath);
		}
	}
}

/**
 * 查找各插件压缩包自带的*.sublime-menu、*.sublime-menucommands
 */
function unzip(dir) {
	fs.readdir(dir, function(err, files) {
		if (!err) {
			files.forEach(function(item) {
				var zipFile;
				try {
					zipFile = new AdmZip(path.join(dir, item));
				} catch (ex) {

				}
				if (zipFile) {
					zipFile.getEntries().forEach(function(zipEntry) {
						if (/\w+\.sublime-(menu|commands)$/.test(zipEntry.entryName)) {
							hanJsonFile(zipFile.readAsText(zipEntry.entryName), item.replace(/\.sublime-package$/, "/" + zipEntry.entryName));
						}
					});
				}
			});
		}
	});
}

/**
 * 查找各插件文件夹自带的*.sublime-menu、*.sublime-menucommands
 */
fs.readdir(".", function(err, dirs) {
	if (!err) {
		dirs.forEach(function(dir) {
			fs.readdir(dir, function(err, files) {
				if (!err) {
					files.forEach(function(file) {
						if (/\w+\.sublime-(menu|commands)$/.test(file)) {
							fs.readFile(path.join(dir, file), function(err, data) {
								if (!err) {
									hanJsonFile(data.toString(), path.join(dir, file));
								}
							});
						}
					});
				}
			});
		});
	}
});

setTimeout(function() {
	unzip("../Installed Packages");
	unzip("../../Pristine Packages");
	unzip("../../Packages");
}, 1);

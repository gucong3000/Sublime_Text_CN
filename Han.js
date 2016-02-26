#!/usr/bin/env node

/*jshint node: true */
"use strict";
var fs = require("fs-extra") || require("fs"),
	AdmZip = require("adm-zip"),
	path = require("path"),
	dirPackages = path.join(__dirname, "Data/Packages"),
	fileCache = {};

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
	"Automatic": "自动编译",
	"Bookmarks": "书签",
	"Bookmarks: Clear All": "Bookmarks: Clear All → 书签: 清除所有",
	"Bookmarks: Select All": "Bookmarks: Select All → 书签: 选择所有",
	"Bookmarks: Select Next": "Bookmarks: Select Next → 书签: 选择下一步",
	"Bookmarks: Select Previous": "Bookmarks: Select Previous → 书签: 选择以前",
	"Bookmarks: Toggle": "Bookmarks: Toggle → 书签: 切换",
	"Bracket Settings – Default": "括号设置 - 默认",
	"Bracket Settings – User": "括号设置 - 用户",
	"BracketHighlighter: Toggle Global Enable": "BracketHighlighter: 切换全局启用",
	"Browse Packages…": "浏览插件…",
	"Build Results": "编译结果",
	"Build System": "编译系统",
	"Build With…": "用其编译…",
	"Cancel Build": "取消编译",
	"Changelog": "更新日志",
	"Changelog…": "更新日志…",
	"Check for Updates…": "检查更新…",
	"Chinese": "中文",
	"Choose Gutter Theme...": "选择简报主题…",
	"Clear Annotations": "清除批注",
	"Clear Caches": "清除缓存",
	"Clear Color Scheme Folder": "清除颜色方案文件夹",
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
	"Code Folding: Fold Tag Attributes": "Code Folding: Fold Tag Attributes → 代码折叠: 折叠标签属性",
	"Code Folding: Unfold All": "Code Folding: Unfold All → 代码折叠: 展开所有",
	"Color Scheme": "配色方案",
	"Columns: 2": "列: 2 窗口",
	"Columns: 3": "列: 3 窗口",
	"Columns: 4": "列: 4 窗口",
	"Command Palette…": "命令面板…",
	"Command": "命令",
	"Comment": "注释",
	"Compact (Break Selectors)": "紧凑 (选择符折行)",
	"Compact (Break Selectors, No Spaces)": "紧凑 (选择符折行，无空格)",
	"Compact (No Spaces)": "紧凑 (无空格)",
	"Compact": "紧凑",
	"Compressed": "压缩",
	"Convert Case": "转换大小写",
	"Convert Case: Lower Case": "Convert Case: Lower Case → 转换案例: 小写",
	"Convert Case: Swap Case": "Convert Case: Swap Case → 转换案例: 交换案例",
	"Convert Case: Title Case": "Convert Case: Title Case → 转换案例: 标题案例",
	"Convert Case: Upper Case": "Convert Case: Upper Case → 转换案例: 大写",
	"Convert Indentation to Spaces": "转换缩进为空格",
	"Convert Indentation to Tabs": "转换缩进为Tab",
	"Copy File Path": "复制文件路径",
	"Copy": "复制",
	"copy": "复制",
	"Cut": "剪切",
	"Debug + arguments": "调试 + 参数",
	"Debug Mode": "调试模式",
	"Debug": "调试",
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
	"DocBlockr: Decorate line comment": "DocBlockr: Decorate line comment → 装饰行注释",
	"DocBlockr: Reparse comment block": "DocBlockr: Reparse comment block → 重解析块注释",
	"Documentation": "帮助文档",
	"Edit Project": "编辑项目",
	"Edit": "编辑",
	"Emmet: Balance (inward)": "Emmet: Balance (inward) → 选中子节点",
	"Emmet: Balance (outward)": "Emmet: Balance (outward) → 选中父节点",
	"Emmet: Decrement Number by 0.1": "Emmet: Decrement Number by 0.1 → 递减0.1",
	"Emmet: Decrement Number by 1": "Emmet: Decrement Number by 1 → 递减1",
	"Emmet: Decrement Number by 10": "Emmet: Decrement Number by 10 → 递减10",
	"Emmet: Encode\\Decode Image to data:URL": "Emmet: Encode\\Decode Image to data:URL → 编码\\解码图片为data:URL",
	"Emmet: Evaluate Math Expression": "Emmet: Evaluate Math Expression → 计算数学表达式的值",
	"Emmet: Expand Abbreviation": "Emmet: Expand Abbreviation → 展开缩写",
	"Emmet: Go to Matching Pair": "Emmet: Go to Matching Pair → 跳转到匹配对",
	"Emmet: Increment Number by 0.1": "Emmet: Increment Number by 0.1 → 递增0.1",
	"Emmet: Increment Number by 1": "Emmet: Increment Number by 1 → 递增1",
	"Emmet: Increment Number by 10": "Emmet: Increment Number by 10 → 递增10",
	"Emmet: Merge Lines": "Emmet: Merge Lines → 合并行",
	"Emmet: Next Edit Point": "Emmet: Next Edit Point → 下一个编辑点",
	"Emmet: Previous Edit Point": "Emmet: Previous Edit Point → 上一个编辑点",
	"Emmet: Reflect CSS Value": "Emmet: Reflect CSS Value → 映射CSS值",
	"Emmet: Reload Extensions": "Emmet: Reload Extensions → 重加载扩展",
	"Emmet: Remove Tag": "Emmet: Remove Tag → 删除标签",
	"Emmet: Rename Tag": "Emmet: Rename Tag → 重命名标签",
	"Emmet: Select Next Item": "Emmet: Select Next Item → 选中下一项",
	"Emmet: Select Previous Item": "Emmet: Select Previous Item → 选中上一项",
	"Emmet: Split\\Join Tag": "Emmet: Split\\Join Tag → 分隔\\合并标签",
	"Emmet: Toggle Comment": "Emmet: Toggle Comment → 切换注释",
	"Emmet: Update Image Size": "Emmet: Update Image Size → 更新图像大小",
	"Emmet: Wrap With Abbreviation": "Emmet: Wrap With Abbreviation → 用缩写包裹",
	"Enter License": "输入许可证",
	"Example Key Bindings": "键绑定示例",
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
	"File: Close All": "File: Close All → 文件: 关闭所有",
	"File: New View into File": "File: New View into File → 文件: 新的视图到文件",
	"File: Revert": "File: Revert → 文件: 恢复",
	"File: Save All": "File: Save All → 文件: 保存所有",
	"Filter Rules by Key": "由键筛选器规则",
	"Find in Files…": "在文件中查找…",
	"Find in Folder…": "在文件夹中查找…",
	"Find Previous": "查找上一个",
	"Find Results": "查找结果",
	"Find": "查找",
	"Find…": "查找…",
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
	"Format CSS: Compact (Break Selectors No Spaces)": "Format CSS: Compact (Break Selectors No Spaces) → 紧凑 (选择符折行，无空格)",
	"Format CSS: Compact (Break Selectors)": "Format CSS: Compact (Break Selectors) → 紧凑 (选择符折行)",
	"Format CSS: Compact (No Spaces)": "Format CSS: Compact (No Spaces) → 紧凑 (无空格)",
	"Format CSS: Compact": "Format CSS: Compact → 紧凑",
	"Format CSS: Compressed": "Format CSS: Compressed → 压缩",
	"Format CSS: Expanded (Break Selectors)": "Format CSS: Expanded (Break Selectors) → 展开 (选择符折行)",
	"Format CSS: Expanded": "Format CSS: Expanded → 展开",
	"Format: Javascript": "Format: Javascript → 格式化: Javascript",
	"Goto Anything…": "转到任何…",
	"Goto Definition": "转到定义",
	"Goto Definition…": "转到定义…",
	"Goto Line…": "转到行…",
	"Goto Symbol in Project…": "转至项目中的符号…",
	"Goto Symbol…": "转到符号…",
	"Goto": "转到",
	"Grid: 4": "网格: 4 画面",
	"Group 1": "分组 1",
	"Group 2": "分组 2",
	"Group 3": "分组 3",
	"Group 4": "分组 4",
	"Groups": "分组",
	"Guess Settings From Buffer": "猜测来自缓冲区的设置",
	"Help": "帮助",
	"Hexadecimal": "十六进制",
	"HTML: Encode Special Characters": "HTML: Encode Special Characters → HTML: 特殊字符进行编码",
	"HTML: Wrap Selection With Tag": "HTML: Wrap Selection With Tag → HTML: 环绕选定内容与标记",
	"Incremental Find": "渐进式查找",
	"Indent Using Spaces": "使用空格缩进",
	"Indentation": "缩进",
	"Indentation: Convert to Spaces": "Indentation: Convert to Spaces → 缩进: 将转换为空格",
	"Indentation: Convert to Tabs": "Indentation: Convert to Tabs → 缩进: 转换成制表符",
	"Indentation: Reindent Lines": "Indentation: Reindent Lines → 缩进: Reindent 线",
	"Insert Line After": "插入至行后",
	"Insert Line Before": "插入至行前",
	"Install": "安装",
	"Jump Back": "向后跳转",
	"Jump Forward": "向前跳转",
	"Jump to Left Bracket": "跳转到左括号",
	"Jump to Matching Bracket": "跳转至匹配的括号",
	"Jump to Right Bracket": "跳转到右括号",
	"Key Bindings – Default": "按键绑定 – 默认",
	"Key Bindings – Example": "按键绑定 – 示例",
	"Key Bindings – User": "按键绑定 – 用户",
	"Larger": "较大",
	"Layout": "窗口布局",
	"LICENSE": "许可证",
	"Line Down": "下移一行",
	"Line Endings": "行尾标识",
	"Line Up": "上移一行",
	"Line": "行",
	"Lint Code": "效验代码",
	"Lint Mode": "检查模式",
	"Lint This View": "检查此视图",
	"List": "列表",
	"Lower Case": "改为小写",
	"Mac OS 9 Line Endings (CR)": "Mac OS 9 换行符 (CR)",
	"Macros": "宏",
	"Make Warnings Passive": "被动警告",
	"Mark Style": "标注风格",
	"Mark": "标记",
	"Match Brackets (ignore threshold)": "匹配括号 (忽略阈值)",
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
	"New Syntax…": "新建语法…",
	"New View into File": "新标签中打开当前文件",
	"New Window": "新建窗口",
	"New Workspace for Project": "为项目新建工作区",
	"Next Error": "下一个错误",
	"Next File in Stack": "堆栈中的下一个文件",
	"Next File": "下一个文件",
	"Next": "下一个",
	"No Column Highlights Line": "高亮线不分列",
	"None": "无",
	"Open Containing Folder…": "打开所在的文件夹…",
	"Open File": "打开文件",
	"Open File…": "打开文件…",
	"Open Folder…": "打开文件夹…",
	"Open in Browser": "在浏览器中打开",
	"Open Project…": "打开项目…",
	"Open Recent": "最近的项目",
	"Open User Settings": "打开用户设置",
	"Open…": "打开…",
	"Package Control": "插件控制",
	"Package Control: Add Channel": "Package Control: Add Channel → 添加资源库链接",
	"Package Control: Add Repository": "Package Control: Add Repository → 添加资源库",
	"Package Control: Advanced Install Package": "Package Control: Advanced Install Package → 高级插件安装",
	"Package Control: Create Binary Package File": "Package Control: Create Binary Package File → 创建二进制插件",
	"Package Control: Create Package File": "Package Control: Create Package File → 创建插件",
	"Package Control: Disable Package": "Package Control: Disable Package → 禁用插件",
	"Package Control: Discover Packages": "Package Control: Discover Packages → 搜索插件",
	"Package Control: Enable Package": "Package Control: Enable Package → 启用插件",
	"Package Control: Grab CA Certs": "Package Control: Grab CA Certs → 获取 CA 证书",
	"Package Control: Install Local Dependency": "Package Control: Install Local Dependency → 安装本地依赖项",
	"Package Control: Install Package": "Package Control: Install Package → 安装插件",
	"Package Control: List Packages": "Package Control: List Packages → 列出插件",
	"Package Control: List Unmanaged Packages": "Package Control: List Unmanaged Packages → 列出未托管插件",
	"Package Control: Remove Channel": "Package Control: Remove Channel → 删除通道",
	"Package Control: Remove Package": "Package Control: Remove Package → 删除插件",
	"Package Control: Remove Repository": "Package Control: Remove Repository → 删除资源库",
	"Package Control: Satisfy Dependencies": "Package Control: Satisfy Dependencies → 满足依赖性",
	"Package Control: Tests": "Package Control: Tests → 测试",
	"Package Control: Upgrade Package": "Package Control: Upgrade Package → 升级插件",
	"Package Control: Upgrade/Overwrite All Packages": "Package Control: Upgrade/Overwrite All Packages → 升级/覆盖所有插件",
	"Package Settings": "插件设置",
	"Packages": "插件",
	"Paste from History": "从历史中粘贴",
	"paste": "粘贴",
	"Permute Lines": "重新排列行序",
	"Permute Lines: Reverse": "Permute Lines: Reverse → 置换行: 反向",
	"Permute Lines: Shuffle": "Permute Lines: Shuffle → 置换行: 洗牌",
	"Permute Lines: Unique": "Permute Lines: Unique → 置换行: 独特",
	"Permute Selections": "重新排列选择",
	"Permute Selections: Reverse": "Permute Selections: Reverse → 排列选择: 反向",
	"Permute Selections: Shuffle": "Permute Selections: Shuffle → 排列选择: 洗牌",
	"Permute Selections: Sort (Case Sensitive)": "Permute Selections: Sort (Case Sensitive) → 排列选择: 排序 (区分大小写)",
	"Permute Selections: Sort": "Permute Selections: Sort → 排列选择: 排序",
	"Permute Selections: Unique": "Permute Selections: Unique → 排列选择: 独特",
	"Playback Macro": "播放宏",
	"Plugin Development: Profile Events": "Plugin Development: Profile Events → 插件开发: 事件简报",
	"Preferences": "首选项",
	"Preferences: Browse Packages": "Preferences: Browse Packages → 首选项: 浏览程序包",
	"Preferences: Key Bindings - Default": "Preferences: Key Bindings - Default → 首选项: 键绑定的默认值",
	"Preferences: Key Bindings - User": "Preferences: Key Bindings - User → 首选项: 键绑定-用户",
	"Preferences: Package Control Settings – Default": "Preferences: Package Control Settings – Default → 插件设置 – 默认",
	"Preferences: Package Control Settings – User": "Preferences: Package Control Settings – User → 插件设置 – 用户",
	"Preferences: Settings - Default": "Preferences: Settings - Default → 首选项: 设置-默认值",
	"Preferences: Settings - User": "Preferences: Settings - User → 首选项: 设置 — 用户",
	"Prettify Code": "代码美化",
	"Previous Error": "上一个错误",
	"Previous File in Stack": "堆栈中的上一个文件",
	"Previous File": "上一个文件",
	"Previous Result": "上一个结果",
	"Previous": "上一个",
	"Project": "项目",
	"Project: Add Folder": "Project: Add Folder → 项目: 添加文件夹",
	"Project: Close": "Project: Close → 项目: 密切",
	"Project: Edit Project": "Project: Edit Project → 项目: 编辑项目",
	"Project: Refresh Folders": "Project: Refresh Folders → 项目: 刷新文件夹",
	"Project: Save As": "Project: Save As → 项目: 将另存为",
	"Publish": "发布",
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
	"Remove Brackets": "删除括号",
	"Remove Folder from Project": "从项目中删除文件夹",
	"Rename…": "重命名…",
	"Reopen Closed File": "重新打开已关闭文件",
	"Reopen with Encoding": "重新打开编码",
	"Replace…": "替换…",
	"Reset": "重置",
	"Reveal in Side Bar": "在侧边栏中显示",
	"Reverse": "反向",
	"Revert File": "还原文件",
	"Rot13 Selection": "Rot13 Selection → Rot13 选定",
	"Rows: 2": "行: 2 窗口",
	"Rows: 3": "行: 3 窗口",
	"Ruler": "标尺",
	"Run + arguments": "运行 + 参数",
	"Run CSScomb": "运行 CSScomb",
	"Run": "运行",
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
	"Search": "搜索",
	"Select Bracket Content with Brackets": "选择括号内容及括号",
	"Select Bracket Content": "选择括号内容",
	"Select Next Attribute (left)": "选择下一个属性 (左)",
	"Select Next Attribute (right)": "选择下一个属性 (右)",
	"Select Tag Name (closing and opening)": "选择标签名 (关闭和打开)",
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
	"Settings – Syntax Specific – User": "设置 - 具体语法 - 用户",
	"Settings – User": "设置 – 用户",
	"Show All Errors": "显示所有的错误",
	"Show Build Results": "显示编译结果",
	"Show Completions": "显示完成",
	"Show Errors on Save": "在保存时显示错误",
	"Show Merged Rules": "显示合并的规则",
	"Show Results Panel": "显示查找结果",
	"Show Unsaved Changes…": "显示未保存的更改…",
	"Shuffle": "无序",
	"Side Bar": "侧边栏",
	"Single": "单窗口",
	"Smaller": "较小",
	"Snippets…": "代码片段…",
	"Sort (Case Sensitive)": "排序(区分大小写)",
	"Sort Lines (Case Sensitive)": "按行排序(区分大小写)",
	"Sort Lines": "按行排序",
	"Sort": "排序",
	"Spell Check": "拼写检查",
	"Split into Lines": "拆分成行",
	"Swap Brackets": "互换括号",
	"Swap Case": "互换大小写",
	"Swap Quotes": "互换引号",
	"Swap Settings – Default": "交换设置 - 默认",
	"Swap Settings – User": "交换设置 - 用户",
	"Swap with Mark": "互换标记",
	"Switch File": "切换文件",
	"Switch Header/Implementation": "切换文件头/执行",
	"Switch Project in Window…": "最近的项目…",
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
	"Tag Settings - User": "标签设置 – 用户",
	"Tag Settings – Default": "标签设置 – 默认",
	"Tag": "标签",
	"Text": "文本",
	"Title Case": "首字母大写",
	"Toggle Block Comment": "开启/关闭段注释",
	"Toggle Comment": "开启/关闭行注释",
	"Toggle High Visibility Mode": "切换高可见性模式",
	"Toggle Linter...": "切换检查器…",
	"Toggle String Bracket Escape Mode": "切换括号内字符串超长隐藏模式",
	"Tools": "工具",
	"Twitter": "推特",
	"Undo Selection": "撤销选择",
	"Unfold All": "展开全部",
	"Uninstall": "卸载",
	"Unique": "唯一",
	"Unix Line Endings (LF)": "Unix 换行符 (LF)",
	"Update": "更新",
	"Upper Case": "改为大写",
	"Use Selection for Find": "在所选内容中查找",
	"Use Selection for Replace": "在所选内容中替换",
	"UTF-16 BE with BOM": "UTF-16BE 包含BOM",
	"UTF-16 LE with BOM": "UTF-16 LE 包含BOM",
	"UTF-8 with BOM": "UTF-8 包含BOM",
	"View README in Github": "在Github上阅读文档",
	"View": "查看",
	"View: Toggle Menu": "View: Toggle Menu → 视图: 切换菜单",
	"View: Toggle Minimap": "View: Toggle Minimap → 视图: 切换地图",
	"View: Toggle Open Files in Side Bar": "View: Toggle Open Files in Side Bar → 视图: 切换在侧栏中打开的文件",
	"View: Toggle Side Bar": "View: Toggle Side Bar → 视图: 切换侧栏",
	"View: Toggle Status Bar": "View: Toggle Status Bar → 视图: 切换状态栏",
	"View: Toggle Tabs": "View: Toggle Tabs → 视图: 切换选项卡",
	"Windows Line Endings (CRLF)": "Windows 换行符 (CRLF)",
	"Word Wrap Column": "自动换行列",
	"Word Wrap": "自动换行",
	"Word Wrap: Toggle": "Word Wrap: Toggle → 单词换行: 切换",
	"Wrap paragraph at 100 characters": "换行段落为 100 个字符",
	"Wrap paragraph at 120 characters": "换行段落为 120 个字符",
	"Wrap paragraph at 70 characters": "换行段落为  70 个字符",
	"Wrap paragraph at 78 characters": "换行段落为  78 个字符",
	"Wrap paragraph at 80 characters": "换行段落为  80 个字符",
	"Wrap Paragraph at Ruler": "换行段落标尺",
	"Wrap Selection With Tag": "包含所选内容的标签",
	"Wrap Selections with Brackets": "用括号包裹选中区域",
	"Wrap Settings – Default": "包裹设置 - 默认",
	"Wrap Settings – User": "包裹设置 - 用户",
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
		obj.forEach(function(subObj) {
			fixObj(subObj, skip);
		});
	} else if (obj && typeof obj === "object") {
		if (skip && obj.id) {
			// 如果是第三方插件的一级菜单
			delete obj.caption;
			delete obj.mnemonic;
			if (obj.id === "preferences" && Array.isArray(obj.children)) {
				obj.children.forEach(function(subObj) {
					if (subObj.id === "package-settings") {
						delete subObj.caption;
						delete subObj.mnemonic;
					}
				});
			}
		} else {
			// 如果是Sublime本身或Package Control的一级菜单
			var hanCaption = "";
			if (obj.caption && hanDate[obj.caption]) {
				// 普通文案翻译
				hanCaption = hanDate[obj.caption];
			} else if (obj.command && commandHan[obj.command]) {
				// 按命令翻译
				hanCaption = commandHan[obj.command];
				if (typeof hanCaption === "object" && obj.args) {
					for (var key in obj.args) {
						break;
					}
					hanCaption = hanCaption[obj.args[key]];
				}
			} else if (obj.caption && obj.args && obj.args.encoding) {
				// 文语言名称翻译
				hanCaption = obj.caption.replace(/^([A-Z]+\w+(?:\s+[A-Z]+\w+)*)(\s\(.*?\))$/, function(s, langName, code) {
					if (langHan[langName]) {
						return langHan[langName] + code;
					} else {
						return s;
					}
				});
			}
			if (hanCaption) {
				if (obj.mnemonic) {
					hanCaption = hanCaption.replace(/(…?)$/, "(" + obj.mnemonic.toUpperCase() + ")$1");
				}
				obj.caption = hanCaption;
			}
		}
		for (var i in obj) {
			fixObj(obj[i]);
		}
	}
	return obj;
}

// 文件数据写入
function hanJsonFile(data, subPath, isReplace) {
	var filePath = path.join(dirPackages, subPath);
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
		var oldDataJson = JSON.stringify(data, null, '\t');

		var newDataJson = JSON.stringify(fixObj(data, /\bMain.sublime-menu(?:\.\w+)?$/.test(subPath) && !/^(?:Default|Package\s+Control)\b/.test(subPath), subPath), null, '\t');
		if (oldDataJson === newDataJson) {

			// 数据未汉化，不写文件
			console.log("ok:\t" + subPath);

		} else {

			if (isReplace) {
				newDataJson = newDataJson.replace(/"`(\$\w+)`"/, "$1");
			}

			// 数据汉化，写文件
			fs.outputFile(filePath, newDataJson, function(err) {
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
	dir = path.join(__dirname, dir);
	if (fs.existsSync(dir)) {
		fs.readdirSync(dir).forEach(function(item) {
			var zipFile;
			try {
				zipFile = new AdmZip(path.join(dir, item));
			} catch (ex) {

			}
			if (zipFile) {
				zipFile.getEntries().forEach(function(zipEntry) {
					if (reExt.test(zipEntry.entryName)) {
						hanJsonFile(zipFile.readAsText(zipEntry.entryName), item.replace(/\.[^\.]+$/, "/" + zipEntry.entryName));
					}
				});
			}
		});
	}
}

unzip("Packages"); // Sublime Text 3/Packages
unzip("Pristine Packages"); // Sublime Text 2/Pristine Packages
unzip("Data/Installed Packages"); // ./Data/Data/Installed Packages

// 查找./Data/Data/Packages各插件文件夹自带的*.sublime-menu、*.sublime-menucommands
fs.readdir(dirPackages, function(err, dirs) {
	if (!err) {
		dirs.forEach(function(dir) {
			dir = path.join(dirPackages, dir);
			fs.readdir(dir, function(err, files) {
				if (!err) {
					files.forEach(function(file) {
						file = path.join(dir, file);
						if (!fileCache[file] && reExt.test(file)) {
							fs.readFile(file, function(err, data) {
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
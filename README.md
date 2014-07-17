Sublime Text CN
===============

Sublime Text 2/3 Chinese language pack

## Package Control ##

我们用sublime几乎都会首先安装这个插件，这个插件是管理插件的功能，先安装它，再安装其他插件就方便了。  安装方法：

1. 按 ctrl+`

2. 输入：

	- 如果你用Sublime Text 3，请输入

	import urllib.request,os,hashlib; h = '7183a2d3e96f11eeadd761d777e62404' + 'e330c659d4bb41d3bdf022e94cab3cd0'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)

	- 如果你用Sublime Text 2，请输入

	import urllib2,os,hashlib; h = '7183a2d3e96f11eeadd761d777e62404' + 'e330c659d4bb41d3bdf022e94cab3cd0'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler()) ); by = urllib2.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); open( os.path.join( ipp, pf), 'wb' ).write(by) if dh == h else None; print('Error validating download (got %s instead of %s), please try manual install' % (dh, h) if dh != h else 'Please restart Sublime Text to finish installation')

3. 状态栏提示安装成功后，重启Sublime Text

4. 按Ctrl+Shift+P。 输入install，回车。稍等一会儿，出现插件列表，输入要安装的插件名字，回车后即开始安装。安装完成后状态栏会有提示。

## 插件推荐 ##

- Emmet：HTML/CSS代码快速编写插件
- JsFormat：JS格式化插件，快捷键：Ctrl+Alt+F
- HTML-CSS-JS Prettify：HTML和CSS代码格式化，Ctrl+Alt+H
- jsHint Gutter：js代码风格检查
- LESS：LESS语法高亮
- SASS：SASS语法高亮

## 汉化与破解 ##

**适用于2.0.2 build 2221**

安装Package Control之后，复制此项目的`Data`文件夹到：

- 绿色版 复制到安装目录
- 安装版 复制Data文件夹下所有文件到`%APPDATA%/Sublime Text 2/`下

**适用于3.0 beta build 3059**

汉化需要借助WinRAR

1. 将此项目的`Packages/Default/*`压缩进安装目录下`./Packages/Default.sublime-package`
2. 将此项目的`Packages/Package Control/*`压缩进：
	- 绿色版 压缩进安装目录下`Data/Installed Packages/Package Control.sublime-package`
	- 安装版 压缩进`%APPDATA%/Sublime Text 3/Installed Packages/Package Control.sublime-package`

破解借助 [Sublime Text 3059 Crack By Lfqy.exe](Sublime Text 3059 Crack By Lfqy.exe?raw=true) 即可
@echo Off
:START
CLS
echo *=========================================================================*
echo *                        注意: 该bat文件必须和sublime_text.exe在同级目录  *
echo *                            [H]汉化                                      *
echo *                            [A]添加右键菜单                              *
echo *                            [D]删除右键菜单                              *
echo *                            [Q]退出                                      *
echo *                                                                         *
echo *=========================================================================*
Set /P Choice=　　　　　　　请选择要进行的操作 (A/D/Q) ，然后按回车：
If /I "%Choice%"=="H" Goto :HAN
If /I "%Choice%"=="A" Goto :ADD
If /I "%Choice%"=="D" Goto :DEL
If /I "%Choice%"=="Q" Exit

START

:HAN
CLS
echo 请确保已经安装Node.js
npm install
node Han.js
pause
GOTO :START

:ADD
CLS
set str=%cd%

reg add HKCR\*\shell\SublimeText /ve /d "用Sublime Text打开" /f
reg add HKCR\*\shell\SublimeText /v Icon /d "\"%str:\=\\%\\sublime_text.exe\",0" /f
reg add HKCR\*\shell\SublimeText\Command /ve /d "\"%str:\=\\%\\sublime_text.exe\" \"%%1^\"" /f

reg add HKCR\Directory\shell\sublime /ve /d "添加到Sublime Text工程项目" /f
reg add HKCR\Directory\shell\sublime /v Icon /d "\"%str:\=\\%\\sublime_text.exe\",0" /f
reg add HKCR\Directory\shell\sublime\Command /ve /d "\"%str:\=\\%\\sublime_text.exe\" \"%%1^\"" /f

reg add HKCR\Directory\Background\shell\sublime /ve /d "添加到Sublime Text工程项目" /f
reg add HKCR\Directory\Background\shell\sublime /v Icon /d "\"%str:\=\\%\\sublime_text.exe\",0" /f
reg add HKCR\Directory\Background\shell\sublime\Command /ve /d "\"%str:\=\\%\\sublime_text.exe\" \"%%V^\"" /f
GOTO :START

:DEL
CLS
reg delete HKCR\*\shell\SublimeText /va /f
reg delete HKCR\Directory\shell\sublime /va /f
reg delete HKCR\Directory\Background\shell\sublime /va /f
pause
GOTO :START
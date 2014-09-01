@echo Off
:START
CLS
echo *=========================================================================*
echo *                        注意: 该bat文件必须和sublime_text.exe在同级目录  *
echo *                            [A]添加右键菜单                              *
echo *                            [D]删除右键菜单                              *
echo *                            [Q]退出                                      *
echo *                                                                         *
echo *=========================================================================*
Set /P Choice=　　　　　　　请选择要进行的操作 (A/D/Q) ，然后按回车：
If /I "%Choice%"=="A" Goto :ADD
If /I "%Choice%"=="D" Goto :DEL
If /I "%Choice%"=="Q" Exit
 
START
 
:ADD
CLS
set str=%cd%
echo REGEDIT4> sublime.reg 
echo [HKEY_CLASSES_ROOT\*\shell]>> sublime.reg 
echo [HKEY_CLASSES_ROOT\*\shell\SublimeText]>> sublime.reg 
echo @="用Sublime Text打开">> sublime.reg 
echo "Icon"="\"%str:\=\\%\\sublime_text.exe\",0">> sublime.reg
echo [HKEY_CLASSES_ROOT\*\shell\SublimeText\Command]>> sublime.reg 
echo @="\"%str:\=\\%\\sublime_text.exe\" \"%%1^\"">> sublime.reg 

echo [HKEY_CLASSES_ROOT\Directory\shell\sublime]>> sublime.reg 
echo @="添加到Sublime Text工程项目">> sublime.reg 
echo "Icon"="\"%str:\=\\%\\sublime_text.exe\",0">> sublime.reg
echo [HKEY_CLASSES_ROOT\Directory\shell\sublime\Command]>> sublime.reg 
echo @="\"%str:\=\\%\\sublime_text.exe\" \"%%1^\"">> sublime.reg 

echo [HKEY_CLASSES_ROOT\Directory\Background\shell\sublime]>> sublime.reg 
echo @="添加到Sublime Text工程项目">> sublime.reg 
echo "Icon"="\"%str:\=\\%\\sublime_text.exe\",0">> sublime.reg
echo [HKEY_CLASSES_ROOT\Directory\Background\shell\sublime\Command]>> sublime.reg 
echo @="\"%str:\=\\%\\sublime_text.exe\" \"%%V^\"">> sublime.reg 
echo *=========================================================================*
echo *                                                                         *
echo *   正在将生成的注册信息写入注册表，请点击“是”键钮！                      *
echo *                                                                         *
echo *=========================================================================*
sublime.reg
del sublime.reg
GOTO :START
 
:DEL
echo REGEDIT4> sublime.reg 
echo [-HKEY_CLASSES_ROOT\*\shell\SublimeText]>> sublime.reg 
echo [-HKEY_CLASSES_ROOT\Directory\shell\sublime]>> sublime.reg 
echo [-HKEY_CLASSES_ROOT\Directory\Background\shell\sublime]>> sublime.reg 
sublime.reg
del sublime.reg
GOTO :START
@echo Off
:START
CLS
echo *=========================================================================*
echo *                        ע��: ��bat�ļ������sublime_text.exe��ͬ��Ŀ¼  *
echo *                            [A]����Ҽ��˵�                              *
echo *                            [D]ɾ���Ҽ��˵�                              *
echo *                            [Q]�˳�                                      *
echo *                                                                         *
echo *=========================================================================*
Set /P Choice=����������������ѡ��Ҫ���еĲ��� (A/D/Q) ��Ȼ�󰴻س���
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
echo @="��Sublime Text��">> sublime.reg 
echo "Icon"="\"%str:\=\\%\\sublime_text.exe\",0">> sublime.reg
echo [HKEY_CLASSES_ROOT\*\shell\SublimeText\Command]>> sublime.reg 
echo @="\"%str:\=\\%\\sublime_text.exe\" \"%%1^\"">> sublime.reg 

echo [HKEY_CLASSES_ROOT\Directory\shell\sublime]>> sublime.reg 
echo @="��ӵ�Sublime Text������Ŀ">> sublime.reg 
echo "Icon"="\"%str:\=\\%\\sublime_text.exe\",0">> sublime.reg
echo [HKEY_CLASSES_ROOT\Directory\shell\sublime\Command]>> sublime.reg 
echo @="\"%str:\=\\%\\sublime_text.exe\" \"%%1^\"">> sublime.reg 

echo [HKEY_CLASSES_ROOT\Directory\Background\shell\sublime]>> sublime.reg 
echo @="��ӵ�Sublime Text������Ŀ">> sublime.reg 
echo "Icon"="\"%str:\=\\%\\sublime_text.exe\",0">> sublime.reg
echo [HKEY_CLASSES_ROOT\Directory\Background\shell\sublime\Command]>> sublime.reg 
echo @="\"%str:\=\\%\\sublime_text.exe\" \"%%V^\"">> sublime.reg 
echo *=========================================================================*
echo *                                                                         *
echo *   ���ڽ����ɵ�ע����Ϣд��ע����������ǡ���ť��                      *
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
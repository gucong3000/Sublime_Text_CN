@echo Off
cd /d "%~dp0"
:START
CLS
echo *=========================================================================*
echo *                        ע��: ��bat�ļ������sublime_text.exe��ͬ��Ŀ¼  *
echo *                            [H]����                                      *
echo *                            [A]����Ҽ��˵�                              *
echo *                            [D]ɾ���Ҽ��˵�                              *
echo *                            [Q]�˳�                                      *
echo *                                                                         *
echo *=========================================================================*
Set /P Choice=����������������ѡ��Ҫ���еĲ��� (H/A/D/Q) ��Ȼ�󰴻س���
If /I "%Choice%"=="H" Goto :HAN
If /I "%Choice%"=="A" Goto :ADD
If /I "%Choice%"=="D" Goto :DEL
If /I "%Choice%"=="Q" Exit

START

:HAN
CLS
echo ��ȷ���Ѿ���װNode.js
call npm install
node Han.js
pause
GOTO :START

:ADD
CLS
set str=%cd%

reg add "HKCR\*\shell\Open with Sublime Text" /ve /d "��Sublime Text��" /f
reg add "HKCR\*\shell\Open with Sublime Text" /v Icon /d "\"%str:\=\\%\\sublime_text.exe\",0" /f
reg add "HKCR\*\shell\Open with Sublime Text\Command" /ve /d "\"%str:\=\\%\\sublime_text.exe\" \"%%1^\"" /f

reg add HKCR\Directory\shell\sublime /ve /d "��ӵ�Sublime Text������Ŀ" /f
reg add HKCR\Directory\shell\sublime /v Icon /d "\"%str:\=\\%\\sublime_text.exe\",0" /f
reg add HKCR\Directory\shell\sublime\Command /ve /d "\"%str:\=\\%\\sublime_text.exe\" \"%%1^\"" /f

reg add HKCR\Directory\Background\shell\sublime /ve /d "��ӵ�Sublime Text������Ŀ" /f
reg add HKCR\Directory\Background\shell\sublime /v Icon /d "\"%str:\=\\%\\sublime_text.exe\",0" /f
reg add HKCR\Directory\Background\shell\sublime\Command /ve /d "\"%str:\=\\%\\sublime_text.exe\" \"%%V^\"" /f
GOTO :START

:DEL
CLS
reg delete "HKCR\*\shell\Open with Sublime Text" /va /f
reg delete HKCR\Directory\shell\sublime /va /f
reg delete HKCR\Directory\Background\shell\sublime /va /f
pause
GOTO :START
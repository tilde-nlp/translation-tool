SET processName=BuildProcess.bat
set sendto=janis.teselskis@tilde.lv
set WaitingTime=120
set BuildProject="TTool2015Setup.ism"
set ProductVersion=1.1.0.0
set ISPath2013="c:\program files\installshield\2013 SP1 SAB\system\"


path %path%;Precious\Mail;
mkdir out
cd out
mkdir Release_setup
cd..
XCOPY "..\binaries"  "out\Release_setup" /E /S

pause
attrib -R /S
dir *.dll /s /b /x >files1.txt
dir *.exe /s /b /x >>files1.txt
generateSigner.pl files1.txt sign_ttool_files.bat
rem del files1.txt

echo Jâparaksta Translation tool setup faili. > SignMM.txt
echo Parakstîðanas fails: "E:\6\LetsMT!\Translator2015\Sources\sign_ttool_files.bat" >> SignMM.txt
echo Gaidîðu %WaitingTime% minûtes >> SignMM.txt
if DEFINED sendto blat.exe SignMM.txt -t %sendto% -f codesigner@tilde.lv -subject "Please sign Translation tool setup files" -server pastnieks

SET /a COUNT=1
:TOP1
	IF %COUNT%==%WaitingTime% GOTO END1
	SET /a COUNT+=1
	PING -n 61 127.0.0.1>nul 
	IF NOT EXIST "sign.log" GOTO TOP1  
:END1


rem COPY %BuildProject% "D.ism"
echo building %BuildProject% comp
RMDIR "%temp%\COMP" /S
%ISPath2013%isCmdBld.exe  -p %BuildProject%  -b "%temp%\COMP" -o "\\projekti\valsis\ValSis\Builds\ISM\Merge Modules"   -e Y -x -y  %ProductVersion%

XCOPY "%temp%\COMP\PT\A.1\DiskImages"  "out\Release_setup" /E
REM CD Release\DISK1
REM for %%F in (*.ico) do echo ICON=%%F>>autorun.inf
REM CD ..\..

path %path%;Precious\Mail;
echo Jâparaksta Translation tool relîzes faili. > SignMM.txt
echo Parakstîðanas fails: "E:\6\LetsMT!\Translator2015\Sources\sign_ttool_release.bat" >> SignMM.txt
echo Gaidîðu %WaitingTime% minûtes >> SignMM.txt
if DEFINED sendto blat.exe SignMM.txt -t %sendto% -f codesigner@tilde.lv -subject "Please sign Translation tool release files" -server pastnieks

SET /a COUNT=1
:TOP2
	IF %COUNT%==%WaitingTime% GOTO END2
 	SET /a COUNT+=1
 	PING -n 61 127.0.0.1>nul 
 	IF NOT EXIST "Release_sign.log" GOTO TOP2  
:END2

del "Release_sign.log"

if DEFINED sendto blat.exe SignMM.txt -t %sendto% -f codesigner@tilde.lv -subject "Build process finished" -server pastnieks

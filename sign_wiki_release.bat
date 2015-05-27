set webpage=http://www.tilde.com/
set version=1.1
set logfile=signfile.log
set frameworkbin=C:\Program Files\Microsoft.NET\SDK\v1.1\Bin
set timestamp=http://timestamp.verisign.com/scripts/timstamp.dll
set signature=b5fde1c49d5bda708e155914f0bf7d3e95910be9
path %path%;%frameworkbin%;c:\blat262\full;
echo %date% %time%>"%logfile%"

rem set descr="Translation Tool 2015"
set descr="Wikipedia translator"
set file="out\Release_setup\DISK1\WikiTransSetup.exe"
 chktrust %file% -q
 if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
 chktrust %file% >>"%logfile%"
 
 
copy %logfile% Release_sign.log
del %logfile%

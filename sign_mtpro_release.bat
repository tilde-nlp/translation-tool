set webpage=http://www.tilde.com/
set version=1.2
set logfile=signfile.log
set frameworkbin=C:\Program Files\Microsoft.NET\SDK\v1.1\Bin
set timestamp=http://timestamp.verisign.com/scripts/timstamp.dll
set signature=28c9ebee71acc5bb0bed8f55f3e57955efd15c39
path %path%;%frameworkbin%;c:\blat262\full;
echo %date% %time%>"%logfile%"

set descr="MTPro translator"
set file="out\Release_setup\DISK1\MTProSetup.exe"
 chktrust %file% -q
 if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
 chktrust %file% >>"%logfile%"
 
 
copy %logfile% Release_sign.log
del %logfile%

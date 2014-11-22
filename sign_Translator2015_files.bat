set webpage=http://www.tilde.lv/
set version=1.0.0.0
set logfile=signfile.log
set frameworkbin=C:\Program Files\Microsoft.NET\SDK\v1.1\Bin
set timestamp=http://timestamp.verisign.com/scripts/timstamp.dll
set signature=b5fde1c49d5bda708e155914f0bf7d3e95910be9
path %path%;%frameworkbin%;c:\blat262\full;
echo %date% %time%>"%logfile%"

set descr="d3dcompiler_43"
set file="D:\Source Control\desktopApplication\Debug\d3dcompiler_43.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="d3dcompiler_46"
set file="D:\Source Control\desktopApplication\Debug\d3dcompiler_46.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="ffmpegsumo"
set file="D:\Source Control\desktopApplication\Debug\ffmpegsumo.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="libcef"
set file="D:\Source Control\desktopApplication\Debug\libcef.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="libEGL"
set file="D:\Source Control\desktopApplication\Debug\libEGL.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="libGLESv2"
set file="D:\Source Control\desktopApplication\Debug\libGLESv2.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="pdf"
set file="D:\Source Control\desktopApplication\Debug\pdf.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="d3dcompiler_43"
set file="D:\Source Control\desktopApplication\out\Debug\d3dcompiler_43.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="d3dcompiler_46"
set file="D:\Source Control\desktopApplication\out\Debug\d3dcompiler_46.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="ffmpegsumo"
set file="D:\Source Control\desktopApplication\out\Debug\ffmpegsumo.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="libcef"
set file="D:\Source Control\desktopApplication\out\Debug\libcef.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="libEGL"
set file="D:\Source Control\desktopApplication\out\Debug\libEGL.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="libGLESv2"
set file="D:\Source Control\desktopApplication\out\Debug\libGLESv2.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="pdf"
set file="D:\Source Control\desktopApplication\out\Debug\pdf.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="d3dcompiler_43"
set file="D:\Source Control\desktopApplication\out\Release\d3dcompiler_43.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="d3dcompiler_46"
set file="D:\Source Control\desktopApplication\out\Release\d3dcompiler_46.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="ffmpegsumo"
set file="D:\Source Control\desktopApplication\out\Release\ffmpegsumo.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="libcef"
set file="D:\Source Control\desktopApplication\out\Release\libcef.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="libEGL"
set file="D:\Source Control\desktopApplication\out\Release\libEGL.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="libGLESv2"
set file="D:\Source Control\desktopApplication\out\Release\libGLESv2.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="pdf"
set file="D:\Source Control\desktopApplication\out\Release\pdf.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="d3dcompiler_43"
set file="D:\Source Control\desktopApplication\Release\d3dcompiler_43.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="d3dcompiler_46"
set file="D:\Source Control\desktopApplication\Release\d3dcompiler_46.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="ffmpegsumo"
set file="D:\Source Control\desktopApplication\Release\ffmpegsumo.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="libcef"
set file="D:\Source Control\desktopApplication\Release\libcef.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="libEGL"
set file="D:\Source Control\desktopApplication\Release\libEGL.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="libGLESv2"
set file="D:\Source Control\desktopApplication\Release\libGLESv2.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="pdf"
set file="D:\Source Control\desktopApplication\Release\pdf.dll"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="wow_helper"
set file="D:\Source Control\desktopApplication\Debug\wow_helper.exe"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="wow_helper"
set file="D:\Source Control\desktopApplication\out\Debug\wow_helper.exe"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="cefTLapp"
set file="D:\Source Control\desktopApplication\out\Release\cefTLapp.exe"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="wow_helper"
set file="D:\Source Control\desktopApplication\out\Release\wow_helper.exe"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"

set descr="wow_helper"
set file="D:\Source Control\desktopApplication\Release\wow_helper.exe"
chktrust %file% -q
if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>"%logfile%"
chktrust %file% >>"%logfile%"
copy %logfile% sign.log
del %logfile%

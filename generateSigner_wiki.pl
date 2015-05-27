use warnings;
use strict;

my $dirToDelete = "C:\\builds\\6\\LetsMT!\\Translator2015\\Sources\\";
open (FIN, "<:encoding(UTF8)", $ARGV[0]);
open (FOUT, ">:encoding(UTF8)", $ARGV[1]);

print FOUT "set webpage=http://www.tilde.com/\n";
print FOUT "set version=1.0\n";
print FOUT "set logfile=signfile.log\n";
print FOUT "set frameworkbin=C:\\Program Files\\Microsoft.NET\\SDK\\v1.1\\Bin\n";
print FOUT "set timestamp=http://timestamp.verisign.com/scripts/timstamp.dll\n";
print FOUT "set signature=28c9ebee71acc5bb0bed8f55f3e57955efd15c39\n";
print FOUT "path %path%;%frameworkbin%;c:\\blat262\\full;\n";
print FOUT "echo %date% %time%>\"%logfile%\"\n";

while (my $ex = <FIN>){
	$ex=~s/[\n\r]//;
	$ex=~s/\Q$dirToDelete\E//i;	
	my $name = $ex;
	$name=~s/.*?\\([^\\]+?)\.(?:exe|dll)$/$1/;
	if ($ex =~/(?:Trans.exe)/i){
		print FOUT "\nset descr=\"$name\"\n";
		print FOUT "set file=\"$ex\"\n";
		print FOUT "chktrust %file% -q\n";
		print FOUT "if ERRORLEVEL 1	signcode.exe -sha1 %signature% -n %descr% -i %webpage% -t %timestamp% %file% >>\"%logfile%\"\n";
		print FOUT "chktrust %file% >>\"%logfile%\"\n";	
	}
}

print FOUT "copy %logfile% sign.log\n";
print FOUT "del %logfile%\n";

close(FIN);
close(FOUT);

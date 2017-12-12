using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace PresidencySeleniumTests
{
    class TestData
    { 
        //website URLs for testing web translate
        public static string[] urlArray = {
            @"www.bbc.co.uk",
            @"www.delfi.ee",
            @"www.bild.de",
            @"www.lemonde.fr"
            };

        //test document directories
         public static string[] filesBG = Directory.GetFiles(@"\\tilde.lv\ad\Testing\letsmt\testData\FileTranslate\Presidency\bulgarian");
         public static string[] filesET = Directory.GetFiles(@"\\tilde.lv\ad\Testing\letsmt\testData\FileTranslate\Presidency\estonian");
         public static string[] filesFR = Directory.GetFiles(@"\\tilde.lv\ad\Testing\letsmt\testData\FileTranslate\Presidency\french");
         public static string[] filesDE = Directory.GetFiles(@"\\tilde.lv\ad\Testing\letsmt\testData\FileTranslate\Presidency\german");
         public static string[] filesEN = Directory.GetFiles(@"\\tilde.lv\ad\Testing\letsmt\testData\FileTranslate\Presidency\english");

        //unsupported file
       public static string fileUnsupported = @"\\tilde.lv\ad\Testing\letsmt\testData\FileTranslate\badFiles\cenas2.png";

         //text to translate
       public static string[] textArrayEN =
          {
           "By letter dated 6 August 2007, France notified the Commission of restructuring aid for the FagorBrandt group.",
           "rows 3.2.12.2.8.1 and 3.2.12.2.8.2 are replaced by the following:",
           "French Revolution: The execution of Louis XVI on the Place de la Révolution (now Place de la Concorde) (January 21, 1793)"
          };

        public static string[] textArrayET =
         {
            "Prantsusmaa teatas 6. augusti 2007. aasta kirjas komisjonile FagorBrandti kontserni ümberkorraldusabi.",
            "read 3.2.12.2.8.1 ja 3.2.12.2.8.2 asendatakse järgmisega:",
            "Prantsuse revolutsioon: Louis XVI hukkamine Place de la Révolution (praegu Place de la Concorde) (21. jaanuar 1793)"
          };

        //translated with ET-EN NMT system (smt-85a613e5-5b6f-473a-84a4-d3fdfb0d187e)
        public static string[] translationArrayETEN = {
            "By letter dated 6 August 2007, France notified the Commission of the restructuring aid of the FagorBrandt Group.",
            "rows 3.2.12.2.8.1 and 3.2.12.2.8.2 are replaced by the following:",
            "French Revolution: Louis XVI execution Place de la Révolution (currently Place de la Concorde) (21 January 1793)"
        };

        public static string[][] translationDataArray = { 
            new string[]{"smt-e-transl-de-en","Dies ist Sparta","This is Sparta"},
            new string[] {"smt-e-transl-en-de","This is Sparta","Dies ist Sparta"},
			new string[]{"smt-e-transl-fr-en","Il s’agit Sparte","It is Sparta"}, 
			new string[]{"smt-e-transl-en-fr","This is Sparta","Il s’agit Sparte"},
			new string[]{"smt-85a613e5-5b6f-473a-84a4-d3fdfb0d187e","See on Sparta","It's Sparta"},
			new string[]{"smt-35abecbd-565f-44e3-9999-b6decc5a6eac","This is Sparta","See on Sparta"},
		/*	new string[]{"smt-e-transl-en-cs","",""},
			new string[]{"smt-e-transl-en-cs","",""},
			new string[]{"smt-e-transl-en-it","",""},
			new string[]{"smt-e-transl-it-en","",""},
			new string[]{"smt-e-transl-en-hu","",""},
			new string[]{"smt-e-transl-hu-en","",""},
			new string[]{"smt-e-transl-en-mt","",""},
			new string[]{"smt-e-transl-mt-en","",""},
			new string[]{"smt-e-transl-en-fi","",""},
			new string[]{"smt-e-transl-fi-en","",""},
			new string[]{"smt-e-transl-en-sl","",""},
			new string[]{"smt-e-transl-sl-en","",""},
			new string[]{"smt-e-transl-en-ga","",""},
			new string[]{"smt-e-transl-ga-en","",""},
			new string[]{"smt-e-transl-en-es","",""},
			new string[]{"smt-e-transl-es-en","",""},
			new string[]{"smt-e-transl-en-hr","",""},
			new string[]{"smt-e-transl-hr-en","",""},
			new string[]{"smt-e-transl-en-sk","",""},
			new string[]{"smt-e-transl-sk-en","",""},
			new string[]{"smt-e-transl-en-el","",""},
			new string[]{"smt-e-transl-el-en","",""},
			new string[]{"smt-e-transl-en-pt","",""},
			new string[]{"smt-e-transl-pt-en","",""},
			new string[]{"smt-e-transl-en-lv","",""},
			new string[]{"smt-e-transl-lv-en","",""},
			new string[]{"smt-e-transl-en-ro","",""},
			new string[]{"smt-e-transl-ro-en","",""},
			new string[]{"smt-e-transl-en-da","",""},
			new string[]{"smt-e-transl-da-en","",""},
			new string[]{"smt-e-transl-en-nl","",""},
			new string[]{"smt-e-transl-nl-en","",""},
			new string[]{"smt-e-transl-en-et","",""},
			new string[]{"smt-e-transl-en-et","",""},
			new string[]{"smt-e-transl-en-bg","",""},
			new string[]{"smt-e-transl-bg-en","",""},
			new string[]{"smt-e-transl-en-sv","",""},
			new string[]{"smt-e-transl-sv-en","",""},
			new string[]{"smt-e-transl-en-pl","",""},
			new string[]{"smt-e-transl-pl-en","",""},
			new string[]{"smt-e-transl-en-lt","",""},
			new string[]{"smt-e-transl-lt-en","",""}*/
            };

    }
}

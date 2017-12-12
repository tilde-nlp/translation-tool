using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Support.PageObjects;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PresidencySeleniumTests
{
   class PresidencyProperties
    {
        public static IWebDriver driver { get; set; }
        //baseUrl
        public static string baseUrl = @"https://www.translate2017.eu/";
       // public static string baseUrl = @"http://test-web2.tilde.lv:8081";       
        //text translate
        public static string txtUrl = @"#/text";
        //document translate
        public static string documentUrl = @"#/document";
        //web translate
        public static string webUrl = @"#/www";
        //about
        public static string aboutUrl = "#/about";
        //contact us
        public static string contactUrl = "#/contactUs";
        //sdl plugin page
        public static string pluginUrl = "#/plugin";
        //workshop
        public static string workshopUrl = "#/workshop";      

       //supported languages
        public static string[] supportedLanguagesSrc = { "English","Estonian", "German", "French"};        
        public static string[] supportedLanguagesTrg = { "Estonian", "German", "French" }; //from english
       //supported formats
       public static string[] supportedFileFormats = { "doc", "docx", "xlsx", "pptx", "odt", "odp", "ods", "rtf", "html", "htm", "xhtml", "xht", "txt", "tmx", "xlf", "xlif", "xliff", "sdlxliff", "ttx", "pages" };

        //links in About and Contacts page
        public static string urlPresidencyPage = @"https://www.eu2017.ee/";
        public static string urlCEFeTranslation = @"https://ec.europa.eu/cefdigital/wiki/display/CEFDIGITAL/eTranslation";
        public static string urlTilde = @"https://www.tilde.com";
        public static string emailSupport = @"mailto:support@translate2017.eu";
        public static string emailInfo = @"mailto:info@translate2017.eu";

       //input placeholder text  
        public static string[,] placeholderArray = {
                                    {"Enter the text you want to translate","Machine translation results help to understand the meaning of a source text, but do not equal translation by a human."},
                                    {"Sisesta tekst, mida soovid tõlkida","Masintõlge aitab teksti sisust aru saada, kuid ei asenda inimtõlget"}};      
   }


    class TestData
    {
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

    }
   


    
}

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
        
}

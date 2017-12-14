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
	   //public static string baseUrl = @"https://www.translate2018.eu/";
		//public static string baseUrl = @"http://test-web1.tilde.lv:8081"; //2018
       // public static string baseUrl = @"http://test-web2.tilde.lv:8081";  //2017   
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
        public static string[] supportedLanguagesSrc = { "English","Estonian", "German", "French", "Bulgarian"};        
        public static string[] supportedLanguagesTrg = { "Estonian", "German", "French", "Bulgarian" }; //from english			
		
       //supported formats
       public static string[] supportedFileFormats = { "doc", "docx", "xlsx", "pptx", "odt", "odp", "ods", "rtf", "html", "htm", "xhtml", "xht", "txt", "tmx", "xlf", "xlif", "xliff", "sdlxliff", "ttx", "pages" };

        //links in About and Contacts page
       public static string urlPresidencyPage = TestData.urlPresidencyPageBG;
       public static string urlCEFeTranslation = TestData.urlCEFeTranslationBG;
       public static string urlTilde = TestData.urlTildeBG;
       public static string emailSupport = TestData.emailSupportBG;
       public static string emailInfo = TestData.emailInfoBG;
		
		
       //input placeholder text  
       public static string[,] placeholderArray = TestData.placeholderArrayBG;
       //files and text for transaltion
       public static string[] filesDefault = TestData.filesBG;
       public static string[] textArraySourceDefault = TestData.textArraySourceBG;
       public static string[] textArrayTargetDefault = TestData.textArrayTargetBG;
   }

   class API_properties
   {
       public static string apiBaseUrl = "https://letsmt.eu/";
       public static string appId = "Tilde|EU+Presidency|Web";
       public static string token = " u-dc4cd3c5-ebc9-4213-ac9d-593c896bc0ea";
       public static string uiLang = "en";//default      
       public static string[] systemList =
        {
            "smt-e-transl-lv-en",
            "smt-e-transl-en-pt",
            "smt-e-transl-en-el",
            "smt-e-transl-en-hu",
            "smt-e-transl-en-de",
            "smt-e-transl-en-fr",
            "smt-e-transl-ga-en",
            "smt-e-transl-cs-en",
            "smt-e-transl-fi-en",
            "smt-e-transl-en-ga",
            "smt-e-transl-hr-en",
            "smt-e-transl-en-et",
            "smt-e-transl-pl-en",
            "smt-e-transl-en-hr",
            "smt-e-transl-ro-en",
            "smt-e-transl-en-lv",
            "smt-e-transl-en-es",
            "smt-e-transl-da-en",
            "smt-e-transl-en-da",
            "smt-e-transl-en-nl",
            "smt-e-transl-el-en",
            "smt-e-transl-en-sl",
            "smt-e-transl-en-lt",
            "smt-e-transl-en-sv",
            "smt-e-transl-lt-en",
            "smt-e-transl-en-sk",
            "smt-e-transl-pt-en",
            "smt-e-transl-en-bg",
            "smt-e-transl-en-ro",
            "smt-e-transl-es-en",
            "smt-e-transl-en-pl",
            "smt-e-transl-en-it",
            "smt-e-transl-sv-en",
            "smt-e-transl-fr-en",
            "smt-e-transl-hu-en",
            "smt-e-transl-nl-en",
            "smt-e-transl-et-en",
            "smt-e-transl-it-en",
            "smt-e-transl-mt-en",
            "smt-e-transl-sk-en",
            "smt-e-transl-bg-en",
            "smt-e-transl-en-fi",
            "smt-85a613e5-5b6f-473a-84a4-d3fdfb0d187e",
            "smt-35abecbd-565f-44e3-9999-b6decc5a6eac"            
        };
   }
        
}

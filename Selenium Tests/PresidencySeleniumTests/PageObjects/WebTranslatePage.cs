using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PresidencySeleniumTests
{
    class WebTranslatePage
    {
        public WebTranslatePage()
        {
            PageFactory.InitElements(PresidencyProperties.driver, this);
        }
        //url input
        [FindsBy(How = How.Id, Using = "url")]
        public IWebElement inputUrl { get; set; }

        //search/go/translate button        
        [FindsBy(How = How.Id, Using = "web_translateButton")]
        public IWebElement btnGo { get; set; }

        //translate button
        [FindsBy(How = How.ClassName, Using = "translateButton")]
        public IWebElement btnTranslate { get; set; }

        //cancel translation
        [FindsBy(How = How.ClassName, Using = "cancelButton")]
        public IWebElement btnCancel { get; set; }

        //restore button
        [FindsBy(How = How.ClassName, Using = "restoreButton")]
        public IWebElement btnRestore { get; set; }

        //link to text translate
        [FindsBy(How = How.Id, Using = "web_translation_type_text")]
        public IWebElement btnTextTranslate { get; set; }

        //link to doc translate
        [FindsBy(How = How.Id, Using = "web_translation_type_doc")]
        public IWebElement btnDocTranslate { get; set; }

        //back
        [FindsBy(How = How.Id, Using = "web_refresh_button")]
        public IWebElement btnBack { get; set; }

        //default (visible)lang menu
        [FindsBy(How = How.ClassName, Using = "popSourceLangs")]
        public IWebElement listSrcLanguages { get; set; }

        //iframes        
        [FindsBy(How = How.Id, Using = "websiteFrame")]
        public IWebElement iframeWebpage { get; set; }

        [FindsBy(How = How.Id, Using = "letsmt-translate-page-iframe")]
        public IWebElement iframeWebpageContent { get; set; }
        
        //wait elements      
        public By waitLanguageList = By.Id("popSourceLangs");
        public By waitWebpageFrame = By.Id("letsmt-translate-page-iframe");
        public By waitTranslateBtn = By.ClassName("translateButton");
        public By waitGoBtn = By.Id("web_translateButton");
        public By waitRestoreBtn = By.ClassName("restoreButton");        
       
         /* [FindsBySequence]
           [FindsBy(How = How.ClassName, Using = "popSourceLangs", Priority = 0)]
           [FindsBy(How = How.XPath, Using = "//li[text() = 'English']", Priority = 1)]
           public IWebElement langEn { get; set; } */
    }
}

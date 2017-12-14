using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PresidencySeleniumTests
{
    class TextTranslatePage
    {
        public TextTranslatePage()
        {
            PageFactory.InitElements(PresidencyProperties.driver, this);
        }

        //reverse languages
        [FindsBy(How = How.ClassName, Using = "swapLanguage")]
        public IWebElement swapLanguage { get; set; }

        //dropdown triggers
        [FindsBySequence]
        [FindsBy(How = How.Id, Using = "source_lang_div", Priority = 0)]
        [FindsBy(How = How.ClassName, Using = "trigger", Priority = 1)]
        public IWebElement triggerDropdownSrc { get; set; }

        [FindsBySequence]
        [FindsBy(How = How.Id, Using = "target_lang_div", Priority = 0)]
        [FindsBy(How = How.ClassName, Using = "trigger", Priority = 1)]
        public IWebElement triggerDropdownTrg { get; set; }
        

        //default (visible) language menus
        [FindsBy(How = How.ClassName, Using = "popSourceLangs")]
        public IWebElement menuSrcLanguages { get; set; }

        [FindsBy(How = How.ClassName, Using = "popTargetLangs")]
        public IWebElement menuTrgLanguages { get; set; }

        //language option lists (dropdown)
        [FindsBySequence]
        [FindsBy(How = How.Id, Using = "source_lang_div", Priority = 0)]
        [FindsBy(How = How.ClassName, Using = "options", Priority = 1)]
        public IWebElement optionsSrcLanguages { get; set; }

        [FindsBySequence]
        [FindsBy(How = How.Id, Using = "target_lang_div", Priority = 0)]
        [FindsBy(How = How.ClassName, Using = "options", Priority = 1)]
        public IWebElement optionsTrgLanguages { get; set; }

        //translate text input box
        [FindsBy(How = How.Id, Using = "sourceText")]
        public IWebElement inputSrcText { get; set; }

        //translate text output box
        [FindsBy(How = How.ClassName, Using = "translateTextResult")]
        public IWebElement outputTrgText { get; set; }

        //clear text
        [FindsBy(How = How.ClassName, Using = "translateResultClear")]
        public IWebElement clearText { get; set; }

        //translate button
        [FindsBy(How = How.Id, Using = "text_translate_button")]
        public IWebElement btnTranslate { get; set; }
        
        //placeholders
        [FindsBy(How = How.ClassName, Using = "translateContainerLeft")]
        public IWebElement placeholderSource { get; set; }

        [FindsBy(How = How.ClassName, Using = "translateContainerRight")]
        public IWebElement placeholderTarget { get; set; }

        //active element
        [FindsBy(How = How.ClassName, Using = "active")]
        public IWebElement activeElement { get; set; }


        //source languages
        [FindsBySequence]
        [FindsBy(How = How.ClassName, Using = "popSourceLangs", Priority = 0)]
        [FindsBy(How = How.XPath, Using = "//li[text() = 'English']", Priority = 1)]
        public IWebElement setSrcLanguageEN { get; set; }

        [FindsBySequence]
        [FindsBy(How = How.ClassName, Using = "popSourceLangs", Priority = 0)]
        [FindsBy(How = How.XPath, Using = "//li[text() = 'Estonian']", Priority = 1)]
        public IWebElement setSrcLanguageET { get; set; }

        //target language ET
        [FindsBy(How = How.ClassName, Using = "popTargetLangs", Priority = 0)]
        [FindsBy(How = How.XPath, Using = "//li[text() = 'Estonian']", Priority = 1)]
        public IWebElement setTrgLanguageET { get; set; }

        //wait elements       
        public By waitTranslateInput = By.Id("sourceText");
        public By waitTextResult = By.ClassName("mt-translation");
        public By waitTranslatePlaceholder = By.ClassName("translateContainerLeft");
        public By waitLanguageList = By.ClassName("popTargetLangs");        
        public By waitClearText = By.ClassName("translateResultClear");
        public By waitDropdownTrigger = By.ClassName("trigger");

      
        /* [FindsBy(How = How.Id, Using = "text_source_lang")]
                public IWebElement dropdownSrcLanguage { get; set; }

           //trg language dropdown
           [FindsBy(How = How.Id, Using = "text_target_lang")]
           public IWebElement dropdownTrgLanguage { get; set; }
         */
    }
}

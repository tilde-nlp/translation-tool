using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace PresidencySeleniumTests
{
   class SharedPageObjects
    {
        public SharedPageObjects()
        {
            PageFactory.InitElements(PresidencyProperties.driver, this);
        }

        //language selection
        [FindsBy(How = How.Id, Using = "language_selection")]
        public IWebElement languageSelection { get; set; }

        [FindsBy(How = How.Id, Using = "language_selection_ee")]
        public IWebElement uiLangEE { get; set; }

        [FindsBy(How = How.Id, Using = "language_selection_en")]
        public IWebElement uiLangEN { get; set; }

        //dropdown menu
        [FindsBy(How = How.Id, Using = "main_menu")]
        public IWebElement mainMenu { get; set; }

        [FindsBy(How = How.Id, Using = "menu_about")]
        public IWebElement menuAbout { get; set; }

        [FindsBy(How = How.Id, Using = "menu_contactUs")]
        public IWebElement menuContact { get; set; }

        [FindsBy(How = How.Id, Using = "menu_plugin")]
        public IWebElement menuPlugin { get; set; }

        //translate
        [FindsBy(How = How.Id, Using = "translation_type_text")]
        public IWebElement translateText { get; set; }

        [FindsBy(How = How.Id, Using = "translation_type_doc")]
        public IWebElement translateDoc { get; set; }

        [FindsBy(How = How.Id, Using = "translation_type_web")]
        public IWebElement translateWeb { get; set; }      
       



       //plugin page
       [FindsBy(How = How.Id, Using = "get_plugin")]
        public IWebElement pluginDownload { get; set; }

       [FindsBy(How = How.Id, Using = "plugin_read_rules")]
        public IWebElement pluginRules { get; set; }  

       //wait
       public By waitwaitPluginRules = By.Id("plugin_read_rules");
       
    }
}

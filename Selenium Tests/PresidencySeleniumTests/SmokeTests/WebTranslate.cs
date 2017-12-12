using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System.Threading;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace PresidencySeleniumTests.SmokeTests
{
    class WebTranslate
    {
        [SetUp]
        public void Initialize()
        {
            PresidencyProperties.driver = new ChromeDriver();
            PresidencyProperties.driver.Manage().Window.Size = new Size(1284, 860);
            PresidencyProperties.driver.Navigate().GoToUrl(PresidencyProperties.baseUrl + PresidencyProperties.webUrl);         
        }
        [TearDown]
        public void Cleanup()
        {
            Console.Write("Automated test has been completed!");
            PresidencyProperties.driver.Quit();
        }
     
         /// <summary>
        /// checks detected source language vs an array of websites (for now breaks after 2nd, cause there is no use of checking more)
        /// </summary>
       [Test]
        public void CheckLanguageDetection()
        {
            WebTranslatePage webPageObj = new WebTranslatePage();
            WaitElement.Wait(webPageObj.waitGoBtn);            
            int i = 0;
            foreach (string language in PresidencyProperties.supportedLanguagesSrc)
            {
                webPageObj.inputUrl.SendKeys(TestData.urlArray[i]);
                webPageObj.btnGo.Click();
                WaitElement.Wait(webPageObj.waitTranslateBtn);             
                if (!checkActiveLanguage(language))
                {
                    Assert.Fail("Selected system is wrong. Source language: " + webPageObj.listSrcLanguages.FindElement(By.ClassName("active")).Text + " had to be: " + language);
                }
                webPageObj.inputUrl.Clear();
                i++;
                if (i == 2) break;
            } 
        }
        /// <summary>
        /// goes to website, translates, waits for Restore button to appear
        /// </summary>
        [Test]
        public void TranslateWebPage()
        {           
            WebTranslatePage webPageObj = new WebTranslatePage();
            WaitElement.Wait(webPageObj.waitGoBtn);  
            webPageObj.inputUrl.SendKeys(TestData.urlArray[1]);
            webPageObj.btnGo.Click();
            WaitElement.Wait(webPageObj.waitTranslateBtn);
            try
            {
                webPageObj.btnTranslate.Click();
                WaitElement.Wait(webPageObj.waitRestoreBtn);
            }
            catch { Assert.Fail("Website was not translated"); }
           
        }   
        /// <summary>
        /// checks if an Error message for a wrong address is displayed
        /// </summary>
        [Test]
        public void CheckErrorBadWebpageUrl()
        {
            WebTranslatePage webPageObj = new WebTranslatePage();
            WaitElement.Wait(webPageObj.waitGoBtn);
            webPageObj.inputUrl.SendKeys("dfhmdfmg");
            Thread.Sleep(1000);         
            webPageObj.btnGo.Click();
            WaitElement.Wait(webPageObj.waitTranslateBtn);
            PresidencyProperties.driver.SwitchTo().Frame(webPageObj.iframeWebpage);          
            PresidencyProperties.driver.SwitchTo().Frame(webPageObj.iframeWebpageContent);            
            if (!PresidencyProperties.driver.FindElement(By.TagName("Body")).Text.Contains("Please enter a correct address"))
            {
                Assert.Fail("No error message present");
            }
          
          
        }

        [Test]
        public void GotoTextTranslate()
        {
            WebTranslatePage webPageObj = new WebTranslatePage();
            WaitElement.Wait(webPageObj.waitGoBtn);
            webPageObj.btnTextTranslate.Click();
            if (!PresidencyProperties.driver.Url.Contains(PresidencyProperties.txtUrl)) { Assert.Fail("Went to: " + PresidencyProperties.driver.Url); }

        }

       [Test]
        public void GotoDocTranslate()
        {
            WebTranslatePage webPageObj = new WebTranslatePage();
            WaitElement.Wait(webPageObj.waitGoBtn);   
            webPageObj.btnDocTranslate.Click();
            if (!PresidencyProperties.driver.Url.Contains(PresidencyProperties.documentUrl)){ Assert.Fail("Went to: "+ PresidencyProperties.driver.Url); }
        }

        [Test]
        public void GotoBack()
        {
            WebTranslatePage webPageObj = new WebTranslatePage();
            WaitElement.Wait(webPageObj.waitGoBtn);
            webPageObj.btnBack.Click();
            if (!PresidencyProperties.driver.Url.Contains(PresidencyProperties.txtUrl)) { Assert.Fail("Went to: "+ PresidencyProperties.driver.Url); }
        }

        //-----------------------------------------------------------------------------
        private bool checkActiveLanguage(string language)
        {
            WebTranslatePage webPageObj = new WebTranslatePage();
            if (webPageObj.listSrcLanguages.FindElement(By.ClassName("active")).Text == language) { return true; } else { return false; }
        }
    }
}

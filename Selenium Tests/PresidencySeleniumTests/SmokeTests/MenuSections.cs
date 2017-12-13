using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.IO;

namespace PresidencySeleniumTests.SmokeTests
{
    class MenuSections
    {
        [SetUp]
        public void Initialize()
        {
            PresidencyProperties.driver = new ChromeDriver();
        }
        [TearDown]
        public void Cleanup()
        {
            Console.Write("Automated test has been completed!");
            PresidencyProperties.driver.Close();
            PresidencyProperties.driver.Quit();
        }
        [Test]
        public void CheckContactPageLinks()
        {
            PresidencyProperties.driver.Navigate().GoToUrl(PresidencyProperties.baseUrl+PresidencyProperties.contactUrl);
            if (!CustomMethods.IsElementPresent(By.XPath("//a[contains(@href,'" + PresidencyProperties.emailSupport + "')]")))
            {
                Assert.Fail("support link not present or wrong");
            }
            if (!CustomMethods.IsElementPresent(By.XPath("//a[contains(@href,'" + PresidencyProperties.emailInfo + "')]")))
            {
                Assert.Fail("info link not present or wrong");
            }
        }
        [Test]
        public void CheckAboutPageLinks()
        {
            PresidencyProperties.driver.Navigate().GoToUrl(PresidencyProperties.baseUrl + PresidencyProperties.aboutUrl);
            if (!CustomMethods.IsElementPresent(By.XPath("//a[contains(@href,'" + PresidencyProperties.urlPresidencyPage + "')]")))
            {
                Assert.Fail("Presidency link not present or wrong");
            }
            if (!CustomMethods.IsElementPresent(By.XPath("//a[contains(@href,'" + PresidencyProperties.urlCEFeTranslation + "')]")))
            {
                Assert.Fail("CEF etranslation link not present or wrong");
            }
            if (!CustomMethods.IsElementPresent(By.XPath("//a[contains(@href,'" + PresidencyProperties.urlTilde + "')]")))
            {
                Assert.Fail("Tilde link not present or wrong");
            }
        }

         [Test]
        public void DownloadTradosPlugin()
        {
            SharedPageObjects pageObj = new SharedPageObjects();
            PresidencyProperties.driver.Navigate().GoToUrl(PresidencyProperties.baseUrl + PresidencyProperties.pluginUrl);
            WaitElement.Wait(pageObj.waitwaitPluginRules);
                        
            pageObj.pluginRules.Click();            
            var js = PresidencyProperties.driver as IJavaScriptExecutor;
            if (js != null)
            {
                js.ExecuteScript("document.getElementById('plugin_checkbox').click();");
            }            
                pageObj.pluginDownload.Click();
                //get download directory, check if file is there delete from download directory afterwards
                if (!CustomMethods.CheckFileDownloaded("EUPresidencyTranslator.MTProvider.sdlplugin"))
                {
                Assert.Fail("File was not downloaded");
                }              

        }
    }

}

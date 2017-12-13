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
using System.Drawing;


namespace PresidencySeleniumTests.SmokeTests
{
    [TestFixture]
    class TextTranslate
    {
        [SetUp]
        public void Initialize()
        {
            PresidencyProperties.driver = new ChromeDriver();
            PresidencyProperties.driver.Manage().Window.Size = new Size(1284, 860);
            PresidencyProperties.driver.Navigate().GoToUrl(PresidencyProperties.baseUrl);
            

        }
        [TearDown]
        public void Cleanup()
        {
            Console.Write("Automated test has been completed!");
            PresidencyProperties.driver.Close();
            PresidencyProperties.driver.Quit();
        }
        /// <summary>
        /// check input placeholder texts against a predefined array
        /// </summary>
        [Test]
        public void CheckPlaceholdersTextTranslate()
        {           
            for (int i = 0; i < PresidencyProperties.placeholderArray.GetLength(0); i++)
            {
                    TextTranslatePage txtPageObj = new TextTranslatePage();
                    SharedPageObjects sharedObj = new SharedPageObjects(); 
                    WaitElement.Wait(txtPageObj.waitTranslatePlaceholder);

                    IWebElement[] langList = sharedObj.languageSelection.FindElements(By.TagName("Button")).ToArray();
                    if (txtPageObj.placeholderSource.Text.Contains(PresidencyProperties.placeholderArray[i, 0]) && txtPageObj.placeholderTarget.Text.Contains(PresidencyProperties.placeholderArray[i, 1]))
                    {
                        Console.WriteLine("Placeholder texts match - "+langList[i].Text);
                    }
                    else { Assert.Fail("Placeholder texts do not match"); }
                    //change UI language  
                    if (i < langList.Length-1) { langList[i+1].Click(); }
            }
        }
        /// <summary>
        /// get currently selected language, swap, check active
        /// </summary>
        [Test]
        public void ReverseLanguages()
        {
            TextTranslatePage txtPageObj = new TextTranslatePage();
            WaitElement.Wait(txtPageObj.waitLanguageList);

            string currentLang = txtPageObj.menuSrcLanguages.FindElement(By.ClassName("active")).Text;
            txtPageObj.swapLanguage.Click();
            string selectedAfterSwap = txtPageObj.menuSrcLanguages.FindElement(By.ClassName("active")).Text;

            if (selectedAfterSwap == currentLang)
            {
                Assert.Fail("Languages were not swaped");
            }

        }
        /// <summary>
        /// translates several sentences, checks if there is any translation, then if it matches the previously translated one
        /// </summary>
        [Test]
        public void TranslateSeveralSentencesETEN()
        {
            TextTranslatePage txtPageObj = new TextTranslatePage();          
            WaitElement.Wait(txtPageObj.waitLanguageList);
            txtPageObj.setSrcLanguageET.Click();
            int i= 0;
            foreach (string source in TestData.textArrayET)
            {                
                IWebElement textOutput = txtPageObj.outputTrgText;           
                txtPageObj.inputSrcText.SendKeys(source + "\n");
                txtPageObj.btnTranslate.Click();              
                //wait to be translated, check if target contains source
                WaitElement.Wait(txtPageObj.waitClearText);
                Thread.Sleep(1000);               
                if (txtPageObj.outputTrgText.Text.Contains(source))
                {
                    Assert.Fail("The text was not translated.");
                }
                else
                {
                    if (!txtPageObj.outputTrgText.Text.Contains(TestData.translationArrayETEN[i]))
                    {
                        Assert.Fail("The translation does not match the previously translated one"+"\n"+ txtPageObj.outputTrgText.Text);
                    }
                    txtPageObj.clearText.Click();
                }               
                i++;
            } 
        }
        
        [Test]
        public void LanguageMenuPopulatedSrc()
        {
            TextTranslatePage txtPageObj = new TextTranslatePage();
            WaitElement.Wait(txtPageObj.waitDropdownTrigger);
            txtPageObj.triggerDropdownSrc.Click();           
            IWebElement[] srcLanguages = txtPageObj.optionsSrcLanguages.FindElements(By.TagName("li")).ToArray();   
            var result = PresidencyProperties.supportedLanguagesSrc.Except(CustomMethods.getTextContent(srcLanguages));
            if (result.Count()!= 0) { Assert.Fail("Source language dropdown not populated correctly"); }         
        }
        [Test]
        public void LanguageMenuPopulatedTrgfromEN()
        {
            TextTranslatePage txtPageObj = new TextTranslatePage();
            WaitElement.Wait(txtPageObj.waitDropdownTrigger);
            txtPageObj.setSrcLanguageEN.Click();
            txtPageObj.triggerDropdownTrg.Click();         
            IWebElement[] trgLanguages = txtPageObj.optionsTrgLanguages.FindElements(By.TagName("li")).ToArray();
            var result = PresidencyProperties.supportedLanguagesTrg.Except(CustomMethods.getTextContent(trgLanguages));
            if (result.Count() != 0) { Assert.Fail("Target language dropdown not populated correctly"); }
        }

        [Test]
        public void ClearText()
        {
            TextTranslatePage txtPageObj = new TextTranslatePage();
            WaitElement.Wait(txtPageObj.waitTranslateInput);            
            string sourceTxt = TestData.textArrayEN[0];
            WaitElement.Wait(txtPageObj.waitLanguageList);
            txtPageObj.setSrcLanguageEN.Click();
            txtPageObj.inputSrcText.SendKeys(sourceTxt);
            txtPageObj.btnTranslate.Click();
            WaitElement.Wait(txtPageObj.waitClearText);
            txtPageObj.clearText.Click();
            if(txtPageObj.inputSrcText.Text!="")
            {
                Assert.Fail("Input box not cleared");
            }
            if (txtPageObj.outputTrgText.Text!= PresidencyProperties.placeholderArray[0, 1])
            {
                Assert.Fail("Output box not cleared :" + txtPageObj.outputTrgText.Text + " vs " + PresidencyProperties.placeholderArray[0, 1]);
            }

        }
            
       
    }
}

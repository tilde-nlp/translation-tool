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
using System.Drawing;


namespace PresidencySeleniumTests.SmokeTests
{
    class DocumentTranslate
    {
        [SetUp]
        public void Initialize()
        {
            PresidencyProperties.driver = new ChromeDriver();
            PresidencyProperties.driver.Manage().Window.Size = new Size(1284, 860);
            PresidencyProperties.driver.Navigate().GoToUrl(PresidencyProperties.baseUrl+PresidencyProperties.documentUrl);
        }
        [TearDown]
        public void Cleanup()
        {
            Console.Write("Automated test has been completed!");
            PresidencyProperties.driver.Close();
            PresidencyProperties.driver.Quit();
        }
       
/// <summary>
/// Upload png file, check if error text contains supported formats
/// </summary>
        [Test]
        public void CheckErrorUnsupportedFile()
        {          
            DocumentTranslatePage docPageObj = new DocumentTranslatePage();
            WaitElement.Wait(docPageObj.waitDocumentInput);
            docPageObj.inputDocUpload.SendKeys(TestData.fileUnsupported);
            WaitElement.Wait(docPageObj.waitError);
            if (docPageObj.msgError.Text.Contains("is not recognized"))
            {
                foreach(string format in PresidencyProperties.supportedFileFormats)
                {
                    if (!docPageObj.msgError.Text.Contains(format))
                    {
                        Assert.Fail("The list of supported files should contain "+ format);
                    }
                } 
            }
            else{ Assert.Fail("There was no error message or the message text was incorrect"); }
        }
/// <summary>
/// Test for checking supported docs with ET NMT system
/// </summary>
        [Test]
        public void TranslateSupportedFilesDefaultSystem()
        {
            DocumentTranslatePage docPageObj = new DocumentTranslatePage();
            WaitElement.Wait(docPageObj.waitDocumentInput);           
            Stack<string> failedDocuments= TranslateDocument(PresidencyProperties.filesDefault, docPageObj);
            if (failedDocuments.Count > 0)
            { Assert.Fail(string.Join(", \n", failedDocuments)); }
        }

/// <summary>
/// Uploads and translates supported documents
/// </summary>
/// <param name="fileList"></param>
/// <param name="DocTranslate"></param>
/// <returns></returns>
        private Stack<string> TranslateDocument(string[] fileList, DocumentTranslatePage DocTranslate)
        {
            Stack<string> failedDocuments = new Stack<string>();
            foreach (string name in fileList)
            {
                if (!name.Contains("Thumbs"))
                {
                    try
                    {
                        DocTranslate.inputDocUpload.SendKeys(name);
                        var TheElement = WaitElement.WaitGivenSeconds(DocTranslate.btnTranslateFinderOrError, 70);
                        if (TheElement.GetAttribute("class").Contains("infoMessageBox"))
                        {                          
                            failedDocuments.Push(name + ": " + TheElement.Text);
                            continue;
                        }

                        DocTranslate.btnTranslate.Click();
                        var TheElement2 = WaitElement.WaitGivenSeconds(DocTranslate.btnDownloadFinderOrError,70);
                        if (TheElement2.GetAttribute("class").Contains("infoMessageBox"))
                        {
                            failedDocuments.Push(name + ": " + TheElement2.Text);
                            continue;
                        }
                        DocTranslate.btnDownload.Click();                       
                        Thread.Sleep(3000); //pause while file is being downloaded
                    }
                    catch (WebDriverTimeoutException) { failedDocuments.Push(name + ": " + "Failed to translate in 70 seconds"); }
                    DocTranslate.btnCancel.Click();     
                 
                }
            }
            return failedDocuments;
        }

    }
}

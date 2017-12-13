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

        [Test]
        public void SupportedFileTypesETEN()
        {
            DocumentTranslatePage docPageObj = new DocumentTranslatePage();
            WaitElement.Wait(docPageObj.waitDocumentInput);
            int ErrorCount = 0;
            ErrorCount = TranslateDocument(TestData.filesET, docPageObj);
            if (ErrorCount > 0)
            { Assert.Fail("Error translating or failed to translate in 60 seconds"); }
        }

//-----------------------------------------------------------------------------------------------------------------------
        private int TranslateDocument(string[] fileList, DocumentTranslatePage DocTranslate)
        {
            int ErrorCount = 0;
            foreach (string name in fileList)
            {
                if (!name.Contains("Thumbs"))
                {
                    try
                    {
                        DocTranslate.inputDocUpload.SendKeys(name);
                        var TheElement = WaitElement.WaitShort(DocTranslate.btnTranslateFinderOrError);
                        if (TheElement.GetAttribute("class").Contains("infoMessageBox"))
                        {
                            Console.WriteLine("Error: " + TheElement.Text + "\n" + "File: " + name + "\n");
                            ErrorCount++;
                            continue;
                        }

                        DocTranslate.btnTranslate.Click();
                        var TheElement2 = WaitElement.WaitShort(DocTranslate.btnDownloadFinderOrError);
                        if (TheElement2.GetAttribute("class").Contains("infoMessageBox"))
                        {
                            Console.WriteLine("Error: " + TheElement.Text+"\n"+ "File: " + name + "\n");                            
                            ErrorCount++;
                            continue;
                        }
                        DocTranslate.btnDownload.Click();
                        Console.WriteLine("File: " + name + " translated \n");
                        Thread.Sleep(3000); //pause while file is being downloaded
                    }
                    catch (WebDriverTimeoutException) { Console.WriteLine("Failed to translate in 60 seconds: " + name); ErrorCount++; }
                    DocTranslate.btnCancel.Click();     
                 
                }
            }
            return ErrorCount;
        }

    }
}

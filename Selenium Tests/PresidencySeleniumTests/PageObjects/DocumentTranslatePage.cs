using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using NUnit.Framework;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PresidencySeleniumTests
{
    class DocumentTranslatePage
    {
        public DocumentTranslatePage()
        {
            PageFactory.InitElements(PresidencyProperties.driver, this);
        }
        //docUploadFile
        [FindsBy(How = How.Id, Using = "docUploadFile")]
        public IWebElement docUpload { get; set; }

        //input
        [FindsBy(How = How.TagName, Using = "input")]
        public IWebElement inputDocUpload { get; set; }

        //progress
        [FindsBy(How = How.ClassName, Using = "percent")]
        public IWebElement progress { get; set; }

        //translate button
        [FindsBy(How = How.Id, Using = "doc_translateButton")]
        public IWebElement btnTranslate { get; set; }

        //btnDownload
        [FindsBy(How = How.Id, Using = "doc_downloadButton")] 
        public IWebElement btnDownload { get; set; }

        //btnDownload
        [FindsBy(How = How.Id, Using = "doc_cancel")]
        public IWebElement btnCancel { get; set; }

        //TranslateFile
        [FindsBy(How = How.Id, Using = "translateFile")]
        public IWebElement translateFile { get; set; }

        [FindsBy(How = How.ClassName, Using = "error")]
        public IWebElement  msgError { get; set; }


        //btnTranslateFinderOrError
        public By btnTranslateFinderOrError = By.XPath("//div[@class='infoMessageBox error'] | //a[@id='doc_translateButton']");
        //btnDownloadFinderOrError
        public By btnDownloadFinderOrError = By.XPath("//div[@class='infoMessageBox error'] | //a[@id='doc_downloadButton']");


        //wait elements      
        public By waitDocumentInput = By.Id("docUploadFile");
        public By waitError = By.ClassName("error");
        public By waitDownloadBtn = By.Id("doc_downloadButton");
        
    }
}

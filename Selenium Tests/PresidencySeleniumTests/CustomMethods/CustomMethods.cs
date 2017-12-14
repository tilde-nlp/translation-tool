using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.IO;

namespace PresidencySeleniumTests
{
    class CustomMethods
    {
        public static bool IsElementPresent(By by)
        {
            try
            {
                PresidencyProperties.driver.FindElement(by);
                return true;
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }
        //check if file got downloaded, delete afterwards
        public static bool CheckFileDownloaded(string filename)
        {
            Thread.Sleep(2000);
            bool exist = false;
            string Path = System.Environment.GetEnvironmentVariable("USERPROFILE") + "\\Downloads";
            string[] filePaths = Directory.GetFiles(Path);
            foreach (string p in filePaths)
            {
                if (p.Contains(filename))
                {
                    FileInfo thisFile = new FileInfo(p);
                    //Check the file that are downloaded in the last 3 minutes
                    if (thisFile.LastWriteTime.ToShortTimeString() == DateTime.Now.ToShortTimeString() ||
                    thisFile.LastWriteTime.AddMinutes(1).ToShortTimeString() == DateTime.Now.ToShortTimeString() ||
                    thisFile.LastWriteTime.AddMinutes(2).ToShortTimeString() == DateTime.Now.ToShortTimeString() ||
                    thisFile.LastWriteTime.AddMinutes(3).ToShortTimeString() == DateTime.Now.ToShortTimeString())
                    exist = true;
                    File.Delete(p);
                    break;
                }
            }
            return exist;
        }

        public static Stack<string> getTextContent(IWebElement[] elements)
        {
            Stack<string> objectText = new Stack<string>();
            foreach (IWebElement element in elements)
            {
                objectText.Push(element.Text);
            }
            return objectText;
        }
    }
}

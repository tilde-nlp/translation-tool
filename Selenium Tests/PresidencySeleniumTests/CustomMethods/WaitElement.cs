using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PresidencySeleniumTests
{
    class WaitElement
    {
        public static IWebElement Wait(By element)
        {
            WebDriverWait wait = new WebDriverWait(PresidencyProperties.driver, TimeSpan.FromMinutes(10));
            return wait.Until(ExpectedConditions.ElementIsVisible(element));
        }
        public static IWebElement WaitTTC(By element)
        {
            WebDriverWait wait = new WebDriverWait(PresidencyProperties.driver, TimeSpan.FromMinutes(10));
            return wait.Until(ExpectedConditions.ElementIsVisible(element));
        }

        public static IWebElement WaitForTranslate(By element)
        {
            WebDriverWait wait = new WebDriverWait(PresidencyProperties.driver, TimeSpan.FromMinutes(35));
            return wait.Until(ExpectedConditions.ElementIsVisible(element));
        }

        public static IWebElement WaitToBeClickable(By element)
        {
            WebDriverWait wait = new WebDriverWait(PresidencyProperties.driver, TimeSpan.FromMinutes(10));
            return wait.Until(ExpectedConditions.ElementToBeClickable(element));
        }

        public static IWebElement WaitShort(By element)
        {
            WebDriverWait wait = new WebDriverWait(PresidencyProperties.driver, TimeSpan.FromSeconds(70));
            return wait.Until(ExpectedConditions.ElementIsVisible(element));
        }
    }
}

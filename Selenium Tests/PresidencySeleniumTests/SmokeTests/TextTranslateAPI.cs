using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace PresidencySeleniumTests
{
    [TestFixture]
    class TextTranslateAPI
    {
      /// <summary>
      /// Compare returned system list against system ID array defined in properties
      /// </summary>      
      [Test]
      public void APIGetSystemList()
      {           
        string url = API_properties.apiBaseUrl + @"ws/service.svc/json/GetSystemList?appID="+ API_properties.appId+"&uiLanguageID="+ API_properties.uiLang;
        string response = HttpGetWithToken(url, API_properties.token);
        Stack<string> missingSystems = CheckSystemList(response, API_properties.systemList);
        if (missingSystems.Count > 0)
        { Assert.Fail("Missing systems:\n"+string.Join(", \n", missingSystems)); }           
       }

       
        private void APITranslate()
        { 	
			foreach(string [] data in TestData.translationDataArray)
			{
				string systemID=data[0]; string txtSource=data[1];string txtTarget=data[2];
				//send request with system data and txtSource, translate
			}
        }


        public string HttpGetWithToken(string url, string token)
        {
            HttpWebRequest req = WebRequest.Create(url) as HttpWebRequest;
            req.Method = "GET";
            string result = null; req.ContentType = "text/x-json";
            req.Headers.Add("client-id", token);
            try
            {
                using (HttpWebResponse resp = req.GetResponse() as HttpWebResponse)
                {
                    StreamReader reader = new StreamReader(resp.GetResponseStream());
                    result = reader.ReadToEnd();
                }

            }
            catch (WebException ex) //catch webexception
            {
                HttpWebResponse respEx = (HttpWebResponse)ex.Response;
                StreamReader reader = new StreamReader(respEx.GetResponseStream());
                result = reader.ReadToEnd();
            }
            catch (Exception e)
            {
                Console.WriteLine("Ex: " + e.Message);
            }
            return result;
        }

        public Stack<string> CheckSystemList(string response, string[] sysIDs)
        {
            Stack<string> missingList = new Stack<string>();           
            dynamic jResponse = JsonConvert.DeserializeObject(response);
            List<string> responseIDList = new List<string>();           
            foreach (var sys in jResponse.System)
            {
                responseIDList.Add(sys.ID.ToString());
            }
            for (int i = 0; i < sysIDs.Length; i++)
            {
                if (!responseIDList.Contains(sysIDs[i]))
                {
                    missingList.Push(sysIDs[i]); 
                }           
            }
            return missingList;
        }
    }

}

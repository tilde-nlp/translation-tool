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

    class API_properties
    {
        public static string apiBaseUrl = "https://letsmt.eu/";
        public static string appId = "Tilde|EU+Presidency|Web";
        public static string token = " u-dc4cd3c5-ebc9-4213-ac9d-593c896bc0ea";
        public static string uiLang = "en";//default
        public static string[] systemList =
        {
            "smt-e-transl-lv-en",
            "smt-e-transl-en-pt",
            "smt-e-transl-en-el",
            "smt-e-transl-en-hu",
            "smt-e-transl-en-de",
            "smt-e-transl-en-fr",
            "smt-e-transl-ga-en",
            "smt-e-transl-cs-en",
            "smt-e-transl-fi-en",
            "smt-e-transl-en-ga",
            "smt-e-transl-hr-en",
            "smt-e-transl-en-et",
            "smt-e-transl-pl-en",
            "smt-e-transl-en-hr",
            "smt-e-transl-ro-en",
            "smt-e-transl-en-lv",
            "smt-e-transl-en-es",
            "smt-e-transl-da-en",
            "smt-e-transl-en-da",
            "smt-e-transl-en-nl",
            "smt-e-transl-el-en",
            "smt-e-transl-en-sl",
            "smt-e-transl-en-lt",
            "smt-e-transl-en-sv",
            "smt-e-transl-lt-en",
            "smt-e-transl-en-sk",
            "smt-e-transl-pt-en",
            "smt-e-transl-en-bg",
            "smt-e-transl-en-ro",
            "smt-e-transl-es-en",
            "smt-e-transl-en-pl",
            "smt-e-transl-en-it",
            "smt-e-transl-sv-en",
            "smt-e-transl-fr-en",
            "smt-e-transl-hu-en",
            "smt-e-transl-nl-en",
            "smt-e-transl-et-en",
            "smt-e-transl-it-en",
            "smt-e-transl-mt-en",
            "smt-e-transl-sk-en",
            "smt-e-transl-bg-en",
            "smt-e-transl-en-fi",
            "smt-f313a5e6-f532-47f4-aa8c-5a963e933a0b",
            "smt-85a613e5-5b6f-473a-84a4-d3fdfb0d187e",
            "smt-35abecbd-565f-44e3-9999-b6decc5a6eac",
            "smt-3ea525f9-e9b4-4b30-8c14-febb66e40f6e"
        };

    }
   
}

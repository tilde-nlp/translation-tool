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
using System.Net.Http;


namespace PresidencySeleniumTests
{
    [TestFixture]
    class TextTranslateAPI
    {
        /// <summary>
        /// Compares returned system list against system ID array defined in properties
        /// </summary>
        [Test]
        public void APIGetSystemList()
        {
            Requests request = new Requests();
            var response = request.GetRequest(API_properties.apiBaseUrl + @"ws/service.svc/json/GetSystemList?appID=" + API_properties.appId + "&uiLanguageID=" + API_properties.uiLang, API_properties.token);
            Stack<string> missingSystems = new Stack<string>();
            dynamic jResponse = JsonConvert.DeserializeObject(response.Result);
            List<string> responseIDList = new List<string>();
            foreach (var sys in jResponse.System)
            {
                responseIDList.Add(sys.ID.ToString());
            }
            for (int i = 0; i < API_properties.systemList.Length; i++)
            {
                if (!responseIDList.Contains(API_properties.systemList[i]))
                {
                    missingSystems.Push(API_properties.systemList[i]);
                }
            }
            if (missingSystems.Count > 0)
            { Assert.Fail("Missing systems:\n" + string.Join(", \n", missingSystems)); }
        }

        /// <summary>
        /// sends POST request, checks translation against pretranslated text in TestData.translationDataArray
        /// </summary>
        [Test]
        public void APITranslateEx()
        {
            //data[0] systemID, data[1] source text, data[2] translation to match
            Stack<string> failedSystems = new Stack<string>();
            foreach (string[] data in TestData.translationDataArray)
            {
                string systemID = data[0]; string txtSource = data[1]; string txtTarget = data[2];
                Requests request = new Requests();
                var resp = request.TranslExPOST(API_properties.apiBaseUrl + "ws/service.svc/json/TranslateEx", API_properties.token, data[0], data[1]);
                string translation = JObject.Parse(resp.Result)["translation"].ToString();
                if (translation != data[2])
                {
                    failedSystems.Push(data[0] + " - " + data[2] + " vs " + translation + "\n");
                }
            }
            if (failedSystems.Count > 0)
            { Assert.Fail(string.Join(", \n", failedSystems)); }
        }
    }

    class Requests
    {
        public async Task<string> TranslExPOST(string url, string token, string systemId, string textToTranslate )
        {                      
            Uri requestUri = new Uri(url);
            var data = new { appID = "Tilde|EU Presidency|Web", text = textToTranslate, systemID = systemId };
            string json = JsonConvert.SerializeObject(data);
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("client-id", token);
            HttpResponseMessage resp = await client.PostAsync(requestUri, new StringContent(json, System.Text.Encoding.UTF8, "application/json"));
            return await resp.Content.ReadAsStringAsync();
        }

        public async Task<string> GetRequest(string url, string token)
        {
            Uri geturi = new Uri(url);
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("client-id", token);
            HttpResponseMessage responseGet = await client.GetAsync(geturi);            
            return await responseGet.Content.ReadAsStringAsync();
        } 
    }

}

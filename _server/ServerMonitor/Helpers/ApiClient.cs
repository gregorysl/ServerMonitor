using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;
using ServerMonitor.Models;

namespace ServerMonitor.Helpers
{
    public static class ApiClient
    {
        public static StringContent CreateHttpContent<T>(object request)
        {
            var sb = new StringBuilder();
            using (var textWriter = new StringWriter(sb))
            {
                using (var jsonWriter = new JsonTextWriter(textWriter))
                {
                    var serialiser = new JsonSerializer();
                    serialiser.Serialize(jsonWriter, request);
                }
            }
            var httpContent = new StringContent(sb.ToString(), Encoding.UTF8, "application/json");
            return httpContent;
        }
        
        public static Response Get<T>(string url)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var responseApi = client.GetAsync(client.BaseAddress).Result;

                if (responseApi.StatusCode != HttpStatusCode.OK)
                {
                    return new Response
                    {
                        Status = Status.Error,
                        Notifications =
                        {
                            new Notification {Status = Status.Error, Message = responseApi.ReasonPhrase}
                        }
                    };
                }

                var result = responseApi.Content.ReadAsStringAsync().Result;

                var response = JsonConvert.DeserializeObject<T>(result);
                return new Response
                {
                    Status = Status.Success,
                    Data = response
                };
            }
        }

        public static Response Put(string url, StringContent httpContent = null)
        {
            using (var client = new HttpClient())
            {
                ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var responseApi = client.PutAsync(client.BaseAddress, httpContent).Result;

                var response = new Response();
                if (responseApi.StatusCode != HttpStatusCode.OK && responseApi.StatusCode != HttpStatusCode.NoContent)
                {
                    response.Status = Status.Error;
                   response.Notifications.Add(new Notification {Status = Status.Error, Message = responseApi.ReasonPhrase});
                }

                return response;
            }
        }

        public static string EnsureSlash(this string url)
        {
            return url.EndsWith(@"/") ? url : url + @"/";
        }
    }
}
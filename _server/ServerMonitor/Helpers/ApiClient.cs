using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;

namespace ServerMonitor.Helpers
{
    public static class ApiClient
    {
        public static StringContent GetHttpContent<T>(object request)
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
        
        public static T Execute<T>(string url, HttpMethod verb, StringContent httpContent = null)
        {
            var result = string.Empty;

            if (verb != HttpMethod.Get && verb != HttpMethod.Post && verb != HttpMethod.Put)
                throw new NotSupportedException($"Verb {verb.Method} not supported");

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage responseApi = null;
                if (verb == HttpMethod.Get)
                {
                    responseApi = client.GetAsync(client.BaseAddress).Result;
                }
                else if (verb == HttpMethod.Post)
                {
                    responseApi = client.PostAsync(client.BaseAddress, httpContent).Result;
                }
                else if (verb == HttpMethod.Put)
                {
                    responseApi = client.PutAsync(client.BaseAddress, httpContent).Result;
                }
                result = responseApi.Content.ReadAsStringAsync().Result;


                var response = JsonConvert.DeserializeObject<T>(result);

                return response;
            }

        }

        public static void Execute(string url, HttpMethod verb, StringContent httpContent = null)
        {
            if (verb != HttpMethod.Get && verb != HttpMethod.Post && verb != HttpMethod.Put)
                throw new NotSupportedException($"Verb {verb.Method} not supported");

            using (var client = new HttpClient())
            {
                ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage responseApi = null;
                if (verb == HttpMethod.Get)
                {
                    responseApi = client.GetAsync(client.BaseAddress).Result;
                }
                else if (verb == HttpMethod.Post)
                {
                    responseApi = client.PostAsync(client.BaseAddress, httpContent).Result;
                }
                else if (verb == HttpMethod.Put)
                {
                    responseApi = client.PutAsync(client.BaseAddress, httpContent).Result;
                }

                if (responseApi.StatusCode != HttpStatusCode.OK && responseApi.StatusCode != HttpStatusCode.NoContent)
                {
                    throw new WebException(responseApi.ReasonPhrase, WebExceptionStatus.UnknownError);
                }
            }

        }

        public static HttpResponseMessage Execute(string url, HttpMethod verb, NetworkCredential credential, StringContent httpContent = null)
        {
            if (verb != HttpMethod.Get && verb != HttpMethod.Post && verb != HttpMethod.Put)
                throw new NotSupportedException($"Verb {verb.Method} not supported");

            using (var handler = new HttpClientHandler { Credentials = credential })
            {
                using (var client = new HttpClient(handler))
                {
                    ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
                    client.BaseAddress = new Uri(url);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    HttpResponseMessage responseApi = null;
                    if (verb == HttpMethod.Get)
                    {
                        responseApi = client.GetAsync(client.BaseAddress).Result;
                    }
                    else if (verb == HttpMethod.Post)
                    {
                        responseApi = client.PostAsync(client.BaseAddress, httpContent).Result;
                    }
                    else if (verb == HttpMethod.Put)
                    {
                        responseApi = client.PutAsync(client.BaseAddress, httpContent).Result;
                    }
                    
                    return responseApi;
                }
            }

        }
    }
}
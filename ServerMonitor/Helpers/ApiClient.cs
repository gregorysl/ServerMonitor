using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using ServerMonitor.Entities;

namespace ServerMonitor.Helpers
{
    public static class ApiClient
    {   
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

        public static string EnsureSlash(this string url)
        {
            return url.EndsWith(@"/") ? url : url + @"/";
        }
    }
}
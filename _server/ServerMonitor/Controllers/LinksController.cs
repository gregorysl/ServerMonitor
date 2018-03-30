using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using Newtonsoft.Json;
using ServerMonitor.Helpers;

namespace ServerMonitor.Controllers
{
    public class LinksController : ApiController
    {
        // GET api/<controller>
        public object Get()
        {
            var links = new List<Link>();
            var config = ConfigurationManager.GetSection("links") as LinksConfigSection;

            foreach (LinkItem e in config.Instances)
            {
                var credentials = !String.IsNullOrWhiteSpace(e.Username) && !String.IsNullOrWhiteSpace(e.Password)
                    ? new NetworkCredential(e.Username, e.Password)
                    : null;
                var link = new Link
                {
                    Name = e.Name,
                    Url = e.Url
                };
                try
                {
                    using (var handler = new HttpClientHandler { Credentials = credentials })
                    {
                        using (var client = new HttpClient(handler))
                        {
                            ServicePointManager.ServerCertificateValidationCallback +=
                                (sender, cert, chain, sslPolicyErrors) => true;
                            client.BaseAddress = new Uri(e.Url, UriKind.Absolute);
                            client.DefaultRequestHeaders.Accept.Clear();
                            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                            var response = client.GetAsync(client.BaseAddress).Result;
                            link.Message = response.StatusCode.ToString();
                            link.Working = response.IsSuccessStatusCode;
                        }
                    }

                }
                catch (Exception ex)
                {
                    link.Working = false;
                    link.Message = GatherExceptions(ex);
                }

                links.Add(link);
            }

            return links;
        }
        

        public static string GatherExceptions(Exception e)
        {
            string exception = $"{e.Message}\\r\\n";
            return e.InnerException != null ? exception + GatherExceptions(e.InnerException) : exception;
        }
    }

    public class Link
    {
        [JsonProperty("key")]
        public object Name { get; set; }
        [JsonProperty("working")]
        public bool Working { get; set; }
        [JsonProperty("message")]
        public object Message { get; set; }
        [JsonProperty("url")]
        public object Url { get; set; }
    }
}
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Web.Mvc;
using Newtonsoft.Json;
using ServerMonitor.Helpers;

namespace ServerMonitor.Controllers
{
    public class LinksController : Controller
    {
        // GET api/<controller>
        public ActionResult Get()
        {
            var links = new List<Link>();
            var config = ConfigurationManager.GetSection("links") as LinksConfigSection;

            foreach (LinkItem e in config.Instances)
            {
                var credentials = !string.IsNullOrWhiteSpace(e.Username) && !string.IsNullOrWhiteSpace(e.Password)
                    ? new NetworkCredential(e.Username, e.Password)
                    : null;

                var response = ApiClient.Execute(e.Url, HttpMethod.Get, credentials);
                links.Add(new Link
                {
                    Name = e.Name,
                    Status = (int) response.StatusCode,
                    Working = response.IsSuccessStatusCode
                });
            }

            return links.ToJsonResult();
        }
    }
    public class Link
    {
        [JsonProperty("key")]
        public string Name { get; set; }
        [JsonProperty("status")]
        public int Status { get; set; }
        [JsonProperty("working")]
        public bool Working { get; set; }
    }
}
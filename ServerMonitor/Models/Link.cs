using Newtonsoft.Json;
using ServerMonitor.Helpers;

namespace ServerMonitor.Models
{
    public class Link
    {
        [JsonProperty("key")]
        public string Name { get; set; }
        [JsonProperty("working")]
        public bool Working { get; set; }
        [JsonProperty("message")]
        public string Message { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("url")]
        public string Url { get; set; }

        public Link(UncheckedLink link)
        {
            Name = link.Name;
            Url = link.Url;
            Type = link.Type;
        }
    }
}
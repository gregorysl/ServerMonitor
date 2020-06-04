using Newtonsoft.Json;

namespace ServerMonitor.Entities
{
    public class Link
    {
        [JsonProperty("key")]
        public string Name { get; set; }
        [JsonProperty("working")]
        public bool Working { get; set; }
        [JsonProperty("message")]
        public string Message { get; set; }
        [JsonProperty("url")]
        public string Url { get; set; }

        public Link(UncheckedLink link)
        {
            Name = link.Name;
            Url = link.Url;
        }
    }
}
using Newtonsoft.Json;

namespace ServerMonitor.Models
{
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
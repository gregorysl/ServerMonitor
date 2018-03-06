using Newtonsoft.Json;

namespace ServerMonitor.Models
{
    public class WebApplication
    {
        [JsonProperty("key")]
        public string Name { get; set; }
    }
}
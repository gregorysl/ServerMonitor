using System.Collections.Generic;
using Newtonsoft.Json;

namespace ServerMonitor.Models
{
    public class IISAppPool
    {
        [JsonProperty("key")]
        public string Id { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("running")]
        public bool Running { get; set; }
        [JsonProperty("children")]
        public IEnumerable<string> Apps { get; set; }
    }
}
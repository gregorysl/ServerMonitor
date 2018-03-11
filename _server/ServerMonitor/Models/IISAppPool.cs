using System.Collections.Generic;
using System.Xml.Serialization;
using Newtonsoft.Json;

namespace ServerMonitor.Models
{
    public class IISAppPool
    {
        [JsonProperty("key")]
        public string Name { get; set; }
        [JsonProperty("running")]
        public string Running { get; set; }
        [JsonProperty("children")]
        public IList<string> Apps { get; set; }
    }
}
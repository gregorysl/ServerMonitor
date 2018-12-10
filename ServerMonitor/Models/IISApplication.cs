using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace ServerMonitor.Models
{
    public class IisApplication
    {
        [JsonProperty("key")]
        public string Name { get; set; }
        [JsonProperty("apps")]
        public IList<IISAppPool> ApplicationPools { get; set; }

        [JsonProperty("whitelisted")]
        public bool Whitelisted { get; set; }

        [JsonProperty("note")]
        public string Note { get; set; }

        [JsonProperty("url")]
        public string Url { get; set; }


        [JsonProperty("running")]
        public bool Running => ApplicationPools.Count(a => a.Running) > ApplicationPools.Count / 2;

        [JsonProperty("state")]
        public string State
        {
            get
            {
                return ApplicationPools.All(a => a.Running)
                    ? "Running"
                    : ApplicationPools.Any(a => a.Running)
                        ? $"{ApplicationPools.Count(a => a.Running)}/{ApplicationPools.Count} running"
                        : "Stopped";
            }
        }

        public IisApplication()
        {
            ApplicationPools = new List<IISAppPool>();
        }
    }
}
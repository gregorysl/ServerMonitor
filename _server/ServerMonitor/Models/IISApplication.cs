using System.Collections.Generic;
using System.Linq;
using Microsoft.Web.Administration;
using Newtonsoft.Json;

namespace ServerMonitor.Models
{
    public class IISApplication
    {
        [JsonProperty("key")]
        public string Name { get; set; }
        [JsonProperty("apps")]
        public IList<IISAppPool> ApplicationPools { get; set; }

        public bool IsWhitelisted { get; set; }

        public string Note { get; set; }

        [JsonProperty("state")]
        public string State
        {
            get
            {
                return ApplicationPools.All(a => a.State == ObjectState.Started.ToString())
                    ? "Running"
                    : ApplicationPools.Any(a => a.State == ObjectState.Started.ToString())
                        ? "Partialy Running"
                        : ObjectState.Stopped.ToString();
            }
        }

        public IISApplication()
        {
            ApplicationPools = new List<IISAppPool>();
        }
    }
}
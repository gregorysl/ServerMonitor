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
        
        public bool Whitelisted { get; set; }

        public string Note { get; set; }

        public string Url { get; set; }

        public bool Running
        {
            get { return ApplicationPools.Any(a => a.Running); }
        }

        public IISApplication()
        {
            ApplicationPools = new List<IISAppPool>();
        }
    }
}
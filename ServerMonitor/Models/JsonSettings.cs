using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel;

namespace ServerMonitor.Helpers
{
    public class JsonSettings
    {
        public List<ServerData> HardwareList { get; set; }
        public List<Link2> Links { get; set; }

        public string WhitelistPath { get; set; }
        public string PathsToCheckSize { get; set; }
        public string ScheduledTasksToView { get; set; }
        public string CacheInSeconds { get; set; }
        public string IsOracleInstanceManagerEnabled { get; set; }
    }

    public class ServerData
    {
        public string Name { get; set; }
        public string Url { get; set; }
    }

    public class Link2 : ServerData
    {
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public string Username { get; set; }

        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public string Password { get; set; }

        [DefaultValue("General")]
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
        public string Type { get; set; }
    }
}

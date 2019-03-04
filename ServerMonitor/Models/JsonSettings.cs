using BuildInspect.Data;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel;

namespace ServerMonitor.Helpers
{
    public class JsonSettings
    {
        public List<ServerData> HardwareList { get; set; } = new List<ServerData>();
        public List<UncheckedLink> Links { get; set; } = new List<UncheckedLink>();
        public List<string> DirsToCheckSize { get; set; } = new List<string>();

        public List<string> ScheduledTasks { get; set; } = new List<string>();
        public string CommonAppName { get; set; }
        public int CacheInSeconds { get; set; }
        public bool IsOracleInstanceManagerEnabled { get; set; }
        public FilterInput Cleaner { get; set; } = new FilterInput();
    }

    public class ServerData
    {
        public string Name { get; set; }
        public string Url { get; set; }
    }

    public class UncheckedLink : ServerData
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

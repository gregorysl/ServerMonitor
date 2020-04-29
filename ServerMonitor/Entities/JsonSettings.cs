using System.Collections.Generic;
using System.ComponentModel;
using Newtonsoft.Json;

namespace ServerMonitor.Entities
{
    public class JsonSettings
    {
        public List<ServerData> HardwareList { get; set; } = new List<ServerData>();
        public List<UncheckedLink> Links { get; set; } = new List<UncheckedLink>();
        public List<string> DirsToCheckSize { get; set; } = new List<string>();

        public List<string> ScheduledTasks { get; set; } = new List<string>();
        public string CommonAppName { get; set; } = "Api";
        public int CacheInSeconds { get; set; }
        public bool IsOracleInstanceManagerEnabled { get; set; }
        public FilterInput Cleaner { get; set; } = new FilterInput();
        public InstanceManagerSettings InstanceManager { get; set; } = new InstanceManagerSettings();
    }

    public class InstanceManagerSettings
    {
        public string Server { get; set; }
        public string Database { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }


        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public bool HasData => !string.IsNullOrWhiteSpace(Server)
                               && !string.IsNullOrWhiteSpace(Database)
                               && !string.IsNullOrWhiteSpace(Username)
                               && !string.IsNullOrWhiteSpace(Password);

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

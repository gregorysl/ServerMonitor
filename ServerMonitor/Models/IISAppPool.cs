using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

namespace ServerMonitor.Models
{
    public class IISAppPool
    {
        public IISAppPool(string path)
        {
            var physicalPath = Environment.ExpandEnvironmentVariables(path);
            var appDir = new DirectoryInfo(physicalPath);
            CreatedDateTime = appDir.CreationTime;
        }
        [JsonProperty("key")]
        public string Name { get; set; }
        [JsonProperty("running")]
        public bool Running { get; set; }
        public string Path { get; set; }
        [JsonIgnore]
        public DateTime CreatedDateTime { get; set; }
        [JsonIgnore]
        public int Days => (DateTime.Now - CreatedDateTime).Days;

    }
}
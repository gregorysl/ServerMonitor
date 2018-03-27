using System;
using Newtonsoft.Json;

namespace ServerMonitor.Models
{
    public class OracleInstanceDetails
    {
        public int Id { get; set; }
        public bool IsReserved { get; set; }
        public string CurrentBuildName { get; set; }
        [JsonIgnore]
        public DateTime CurrentBuildDate { get; set; }
        public string CurrentBuild => CurrentBuildDate.ToString("g");
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Sid { get; set; }
        public string Service { get; set; }
        public bool IsDeploying { get; set; }
    }
}
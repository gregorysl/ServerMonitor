using BuildInspect.Data.Entities;

namespace ServerMonitor.Models
{
    public class IisAction
    {
        public BuildEntity Build { get; set; }
        public string Action { get; set; }
    }
}
using ServerMonitor.Entities;

namespace ServerMonitor.Entities
{
    public class IisAction
    {
        public BuildEntity Build { get; set; }
        public string Action { get; set; }
    }
}
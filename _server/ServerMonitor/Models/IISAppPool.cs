using System.Collections.Generic;

namespace ServerMonitor.Models
{
    public class IISAppPool
    {
        public string Name { get; set; }
        public string State { get; set; }
        public IList<WebApplication> WebApplications { get; set; }
    }
}
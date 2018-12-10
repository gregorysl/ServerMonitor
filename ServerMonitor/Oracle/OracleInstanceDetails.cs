using System;

namespace ServerMonitor.Oracle
{
    public class OracleInstanceDetails
    {
        public int Id { get; set; }
        public bool IsReserved { get; set; }
        public bool IsDeploying { get; set; }
        public string CurrentBuildName { get; set; }
        public DateTime CurrentBuildDate { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Sid { get; set; }
        public string Service { get; set; }
    }
}

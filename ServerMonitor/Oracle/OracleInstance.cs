using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerMonitor.Oracle
{
    public class OracleInstance
    {
        public int Id { get; set; }
        public string Sid { get; set; }
        public string Service { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string CurrentBuildName { get; set; }
        public DateTime CurrentBuildDate { get; set; }
        public bool IsReserved { get; set; }
        public bool IsDeployInProgress { get; set; }
        [ForeignKey("ConnectionDetailsId")]
        public ConnectionDetails ConnectionDetails { get; set; }
        [ForeignKey("BuildServerDetailsId")]
        public BuildServerDetails BuildServerDetails { get; set; }
    }
}

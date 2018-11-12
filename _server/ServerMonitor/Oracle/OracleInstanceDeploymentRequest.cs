
namespace ServerMonitor.Oracle
{
    public class OracleInstanceDeploymentRequest
    {
        public int Id { get; set; }
        public bool Reserve { get; set; }
        public string BuildName { get; set; }
    }
}


namespace ServerMonitor.Oracle
{
    public class OracleInstanceConnectionDetails
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Protocol { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public string Sid { get; set; }
        public string Service { get; set; }
        public string Name { get; set; }
    }
}

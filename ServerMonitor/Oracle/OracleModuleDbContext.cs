using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.SqlClient;

namespace ServerMonitor.Oracle
{
    public class OracleModuleDbContext : DbContext
    {
        public OracleModuleDbContext(string server, string databaseName, string userName, string password)
        {
            var builder = new SqlConnectionStringBuilder
            {
                DataSource = server,
                InitialCatalog = databaseName,
                IntegratedSecurity = false,
                MultipleActiveResultSets = false, 
                PersistSecurityInfo = true,
                UserID = userName,
                Password = password
            };
            Database.Connection.ConnectionString = builder.ConnectionString;
        }

        public DbSet<OracleInstance> OracleInstances { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}

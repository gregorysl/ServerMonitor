using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace ServerMonitor.Oracle
{
    public class OracleModuleDbContext : DbContext
    {
        public OracleModuleDbContext() : base("AutomationDb")
        {
        }

        public DbSet<OracleInstance> OracleInstances { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}

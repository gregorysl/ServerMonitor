using System;
using System.Collections.Generic;
using System.Linq;

namespace ServerMonitor.Oracle
{
    public class OracleInstanceRepository
    {
        protected readonly OracleModuleDbContext Context;

        public OracleInstanceRepository(OracleModuleDbContext context)
        {
            Context = context;
        }

        public virtual OracleInstance GetOldestOracleInstance(string buildServerName)
        {
            var oracleInstances = Context.OracleInstances
                .Where(i => i.BuildServerDetails.Name == buildServerName &&
                            i.IsReserved == false
                         && i.IsDeployInProgress == false
                        /*&& i.CurrentBuildDate == _context.OracleInstances.Min(ins => ins.CurrentBuildDate)*/)
                .OrderBy(i => i.CurrentBuildDate)
                .Select(i => new { OracleInstance = i, ConnectionDetail = i.ConnectionDetails });

            return oracleInstances.FirstOrDefault()?.OracleInstance;
        }

        public IEnumerable<OracleInstance> GetBuildServerInstances(string buildServerName)
        {
            return Context.OracleInstances
                .Where(i => i.BuildServerDetails.Name == buildServerName)
                .ToList();
        }

        public IEnumerable<OracleInstance> GetAllInstances()
        {
            return Context.OracleInstances.ToList();
        }

        public virtual void ReserveInstance(int instanceId)
        {
            var instanceToReserve = Context.OracleInstances.FirstOrDefault(i => i.Id == instanceId && i.IsDeployInProgress == false);

            using (var transaction = Context.Database.BeginTransaction())
            {
                try
                {
                    if (instanceToReserve == null)
                    {
                        throw new NullReferenceException("We have not found requested instance in the database");
                    }

                    instanceToReserve.IsReserved = true;

                    Context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

        public virtual void UnreserveInstance(int instanceId)
        {
            var instanceToReserve = Context.OracleInstances.FirstOrDefault(i => i.Id == instanceId && i.IsDeployInProgress == false);

            using (var transaction = Context.Database.BeginTransaction())
            {
                try
                {
                    if (instanceToReserve == null)
                    {
                        throw new NullReferenceException("We have not found requested in the database");
                    }

                    instanceToReserve.IsReserved = false;

                    Context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

        public virtual bool SetDeployInProgress(int instanceId)
        {
            var instanceToDeployTo = Context.OracleInstances.FirstOrDefault(i => i.Id == instanceId && i.IsReserved == false && i.IsDeployInProgress == false);

            using (var transaction = Context.Database.BeginTransaction())
            {
                try
                {
                    if (instanceToDeployTo == null)
                    {
                        //throw new NullReferenceException("We have not found requested instance in the database");
                        return false;
                    }

                    instanceToDeployTo.IsDeployInProgress = true;

                    Context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }

            return true;
        }

        public virtual void UnsetDeployInProgress(int instanceId)
        {
            var instanceToDeployTo = Context.OracleInstances.FirstOrDefault(i => i.Id == instanceId && i.IsReserved == false);

            using (var transaction = Context.Database.BeginTransaction())
            {
                try
                {
                    if (instanceToDeployTo == null)
                    {
                        throw new NullReferenceException("We have not found requested in the database");
                    }

                    instanceToDeployTo.IsDeployInProgress = false;

                    Context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }


        public virtual void SetCurrentBuildDate(int instanceId)
        {
            var instance = Context.OracleInstances.FirstOrDefault(i => i.Id == instanceId);

            using (var transaction = Context.Database.BeginTransaction())
            {
                try
                {
                    if (instance == null)
                    {
                        throw new NullReferenceException("We have not found requested in the database");
                    }

                    instance.CurrentBuildDate = DateTime.Now;

                    Context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

        public virtual void SetCurrentBuildName(int instanceId, string buildName)
        {
            var instance = Context.OracleInstances.FirstOrDefault(i => i.Id == instanceId);

            using (var transaction = Context.Database.BeginTransaction())
            {
                try
                {
                    if (instance == null)
                    {
                        throw new NullReferenceException("We have not found requested in the database");
                    }

                    instance.CurrentBuildName = buildName;

                    Context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }
    }
}

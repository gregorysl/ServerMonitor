using System;
using System.Collections.Generic;
using System.Linq;

namespace ServerMonitor.Oracle
{
    public class OracleInstanceBl
    {
        protected readonly OracleInstanceRepository OracleInstanceRepository;

        public OracleInstanceBl()
        {
            OracleInstanceRepository = new OracleInstanceRepository(new OracleModuleDbContext());
        }

        public virtual OracleInstanceConnectionDetails GetAvailableInstance(string buildServerName)
        {
            var instance = OracleInstanceRepository.GetOldestOracleInstance(buildServerName);
            if (instance == null)
            {
                return null;
            }

            return new OracleInstanceConnectionDetails
            {
                Id = instance.Id,
                Host = instance.ConnectionDetails.Host,
                Protocol = instance.ConnectionDetails.Protocol,
                Port = instance.ConnectionDetails.Port,
                Sid = instance.Sid,
                Service = instance.Service,
                Username = instance.ConnectionDetails.Username,
                Password = instance.ConnectionDetails.Password,
                Name = instance.Name
            };
        }
        public IEnumerable<OracleInstanceDetails> GetAllInstances()
        {
            var instances = OracleInstanceRepository.GetAllInstances();

            return instances.Select(i => new OracleInstanceDetails
            {
                Id = i.Id,
                IsReserved = i.IsReserved,
                CurrentBuildName = i.CurrentBuildName,
                CurrentBuildDate = i.CurrentBuildDate,
                Name = i.Name,
                DisplayName = i.DisplayName,
                Sid = i.Sid,
                Service = i.Service,
                IsDeploying = i.IsDeployInProgress
            });
        }

        public IEnumerable<OracleInstanceDetails> GetBuildServerInstances(string buildServerName)
        {
            var instances = OracleInstanceRepository.GetBuildServerInstances(buildServerName);
            return instances.Select(i => new OracleInstanceDetails
            {
                Id = i.Id,
                IsReserved = i.IsReserved,
                CurrentBuildName = i.CurrentBuildName,
                CurrentBuildDate = i.CurrentBuildDate,
                Name = i.Name,
                DisplayName = i.DisplayName,
                Sid = i.Sid,
                Service = i.Service
            });
        }

        public void ChangeInstanceReservation(int instanceId, bool reserve)
        {
            if (reserve)
            {
                OracleInstanceRepository.ReserveInstance(instanceId);
            }
            else
            {
                OracleInstanceRepository.UnreserveInstance(instanceId);
            }
        }

        public bool ChangeInstanceDeployInProgress(int instanceId, bool isDeploying, string buildName)
        {
            try
            {
                if (isDeploying)
                {
                    return OracleInstanceRepository.SetDeployInProgress(instanceId);
                }
                else
                {
                    OracleInstanceRepository.UnsetDeployInProgress(instanceId);
                    OracleInstanceRepository.SetCurrentBuildDate(instanceId);
                    OracleInstanceRepository.SetCurrentBuildName(instanceId, buildName);
                    return true;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

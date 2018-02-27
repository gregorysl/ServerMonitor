using System.Collections.Generic;
using System.Linq;
using Microsoft.Web.Administration;

namespace ServerMonitor.Models
{
    public class IISApplication
    {
        public string Name { get; set; }
        public IList<IISAppPool> ApplicationPools { get; set; }

        public bool IsWhitelisted { get; set; }

        public string Note { get; set; }

        public string State
        {
            get
            {
                return ApplicationPools.All(a => a.State == ObjectState.Started.ToString())
                    ? "Running"
                    : ApplicationPools.Any(a => a.State == ObjectState.Started.ToString())
                        ? "Partialy Running"
                        : ObjectState.Stopped.ToString();
            }
        }

        public IISApplication()
        {
            ApplicationPools = new List<IISAppPool>();
        }
    }
}
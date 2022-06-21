using System.Linq;
using System.ServiceProcess;

namespace ServerMonitor.Helpers
{
    public class ServiceHandler
    {
        public void Toggle(string appName)
        {
            var service = ServiceController.GetServices().FirstOrDefault(x => x.ServiceName.EndsWith(appName));

            if (service?.Status == ServiceControllerStatus.Running)
            {
                service?.Stop();
            }
            else
            {
                service?.Start();
            }
        }
    }
}
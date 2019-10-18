using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using log4net;
using Microsoft.Web.Administration;
using ServerMonitor.Entities;
using ServerMonitor.Interfaces;

namespace ServerMonitor
{
    public class CommonNameBuildsProvider : IBuildsProvider
    {
        protected static readonly ILog Log = LogManager.GetLogger(typeof(CommonNameBuildsProvider));
        private const string DEFAULT_WEB_SITE = "Default Web Site";


        private readonly string _commonName;

        public CommonNameBuildsProvider(string commonName)
        {
            _commonName = commonName;
        }

        public IEnumerable<BuildEntity> GetBuilds()
        {
            List<Application> iisApps;

            using (var identity = WindowsIdentity.GetCurrent())
            {
                var principal = new WindowsPrincipal(identity);
                if (!principal.IsInRole(WindowsBuiltInRole.Administrator))
                {
                    Log.Error("Cannot read server manager configs due to insufficient permissions!");
                    throw new UnauthorizedAccessException();
                }
            }
            try
            {
                using (var serverManager = new ServerManager())
                {
                    iisApps = serverManager.Sites[DEFAULT_WEB_SITE].Applications.ToList();
                }
            }
            catch (Exception e)
            {
                Log.Fatal($"There was a problem with loading applications from IIS! { e.Message }");
                throw;
            }


            var builds = iisApps
                .Select(app => app.Path.TrimStart('/'))
                .Where(a => a.EndsWith(_commonName))
                .Select(a => a.Replace(_commonName, "")).ToList();

            if (builds == null)
            {
                Log.Error($"{ _commonName } service was not found in IIS!");
                throw new KeyNotFoundException();
            }

            var apps = iisApps.Where(a => builds.Any(b => a.Path.StartsWith($"/{b}")))
                              .Select(app => new ApplicationEntity(app.Path, app.ApplicationPoolName, app.VirtualDirectories["/"].PhysicalPath)).ToList();

            return builds.Select(b => new BuildEntity(b, apps.Where(a => a.Name.StartsWith(b)).ToList()));
        }
    }
}

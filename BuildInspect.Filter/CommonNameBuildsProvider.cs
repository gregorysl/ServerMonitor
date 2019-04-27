using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using BuildInspect.Data.Entities;
using BuildInspect.Data.Interfaces;
using Microsoft.Web.Administration;

namespace BuildInspect.Filter
{
    public class CommonNameBuildsProvider : IBuildsProvider
    {
        private const string DEFAULT_WEB_SITE = "Default Web Site";

        private static ILogManager LogManager => new NLogManger();

        private readonly string _commonName;

        public CommonNameBuildsProvider(string commonName)
        {
            _commonName = commonName;
        }

        public IEnumerable<BuildEntity> GetBuilds()
        {
            List<Application> iisApps = new List<Application>();

            using (var identity = WindowsIdentity.GetCurrent())
            {
                var principal = new WindowsPrincipal(identity);
                if (!principal.IsInRole(WindowsBuiltInRole.Administrator))
                {
                    LogManager.Error("Cannot read server manager configs due to insufficient permissions!");
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
                LogManager.Critical($"There was a problem with loading applications from IIS! { e.Message }");
                throw;
            }


            var builds = iisApps
                .Select(app => app.Path.TrimStart('/'))
                .Where(a => a.EndsWith(_commonName))
                .Select(a => a.Replace(_commonName, "")).ToList();

            if (builds == null)
            {
                LogManager.Error($"{ _commonName } service was not found in IIS!");
                throw new KeyNotFoundException();
            }

            var apps = iisApps.Where(a => builds.Any(b => a.Path.StartsWith($"/{b}")))
                              .Select(app => new ApplicationEntity(app.Path, app.ApplicationPoolName, app.VirtualDirectories["/"].PhysicalPath)).ToList();

            return builds.Select(b => new BuildEntity(b, apps.Where(a => a.Name.StartsWith(b)).ToList()));
        }
    }
}

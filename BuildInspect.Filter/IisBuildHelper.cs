using BuildInspect.Data.Entities;
using Microsoft.Web.Administration;
using System.Collections.Generic;
using System.Linq;

namespace BuildInspect.Filter
{
    public static class IisBuildHelper
    {
        public static void FillAdditionalData(this IEnumerable<BuildEntity> builds, IEnumerable<string> whitelist = null)
        {
            var appPools = new List<ApplicationPool>();
            using (var serverManager = new ServerManager())
            {
                appPools = serverManager.ApplicationPools.ToList();
            }

            foreach (var build in builds)
            {
                build.Whitelisted = whitelist.Any(x => x == build.Name);
                var apNames = build.Apps.Select(a => a.Pool);
                foreach(var app in build.Apps)
                {
                    var pool = appPools.FirstOrDefault(x => x.Name == app.Pool);
                    app.Running = pool.State == ObjectState.Started;
                }
            }
        }
    }
}

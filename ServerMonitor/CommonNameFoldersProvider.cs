using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Principal;
using log4net;
using Microsoft.Web.Administration;
namespace ServerMonitor
{
    public class CommonNameFoldersProvider
    {
        protected static readonly ILog Log = LogManager.GetLogger(typeof(CommonNameFoldersProvider));
        private const string DefaultWebSite = "Default Web Site";

        public List<string> GetFolders(string name)
        {
            string rootFolder;

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
                    rootFolder = Environment.ExpandEnvironmentVariables(serverManager.Sites[DefaultWebSite].Applications["/"].VirtualDirectories["/"].PhysicalPath);
                }
            }
            catch (Exception e)
            {
                Log.Fatal($"There was a problem with loading applications from IIS! { e.Message }");
                throw;
            }

            var builds = Directory.GetDirectories(rootFolder)
                .Where(a => a.Contains(name))
                .Select(a => a.Replace(rootFolder+"\\", ""))
                .ToList();

            if (builds == null)
            {
                Log.Error($"{ name } folders were not found in {Environment.ExpandEnvironmentVariables(rootFolder)}!");
                throw new KeyNotFoundException();
            }

            return builds;
        }
    }
}

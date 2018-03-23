

using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Management;
using System.Net;
using System.Net.Http;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Xml.Linq;
using Cassia;
using LiteDB;
using Microsoft.Web.Administration;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    public class MonitorController : Controller
    {
        private static string DB_PATH => HostingEnvironment.MapPath("~/App_Data/ServerMonitor.db");

        [HttpGet]
        public ActionResult Recycle(string Name)
        {
            try
            {
                var mgr = new ServerManager();
                var pool = mgr.ApplicationPools.FirstOrDefault(app => app.Name == Name);

                if (pool == null)
                {
                    Response.StatusCode = 404;
                    return new { Message = "Application pool not found." }.ToJsonResult();
                }

                pool.Recycle();

                return new { Message = "Application pool succesfully recycled." }.ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }

        }


        [HttpPost]
        public ActionResult Stop(List<IISAppPool> appPools)
        {
            try
            {
                var poolsNames = appPools.Select(a => a.Name);
                var mgr = new ServerManager();
                var pools = mgr.ApplicationPools.Where(app => poolsNames.Contains(app.Name));

                foreach (var pool in pools)
                {
                    pool.Stop();
                }

                return new { Message = "Application pools stopped successfuly." }.ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }

        }

        [HttpPost]
        public ActionResult Start(List<IISAppPool> appPools)
        {
            try
            {
                var poolsNames = appPools.Select(a => a.Name);
                var mgr = new ServerManager();
                var pools = mgr.ApplicationPools.Where(app => poolsNames.Contains(app.Name));

                foreach (var pool in pools)
                {
                    pool.Start();
                }

                return new { Message = "Application pools started successfuly." }.ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }

        }

        [HttpPost]
        public ActionResult Whitelist(IISApplication application)
        {
            try
            {
                var whitelistFile = ConfigurationManager.AppSettings["WhitelistXmlPath"];
                var whitelist = XDocument.Load(whitelistFile);

                var buildsNode = whitelist.Descendants("builds").First();
                var build = new XElement("build");

                foreach (var appPool in application.ApplicationPools)
                {
                    var poolElement = new XElement("app");
                    poolElement.SetAttributeValue("value", appPool.Name);
                    build.Add(poolElement);
                }

                buildsNode.Add(build);

                using (var file = new StreamWriter(whitelistFile))
                {
                    whitelist.Save(file);
                }

                if (application.Name.EndsWith("-O"))
                {
                    var oracleInstances = GetAllOracleInstances();
                    var instance = oracleInstances.FirstOrDefault(i => i.CurrentBuildName == application.Name.Replace("-O", ""));
                    if (instance != null)
                    {
                        SetReserved(new OracleInstanceReservationRequest
                        {
                            Id = instance.Id,
                            Reserve = true
                        });
                    }
                }

                return new { Message = "Application whitelisted successfuly." }.ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }

        }

        private static List<OracleInstanceDetails> GetAllOracleInstances()
        {
            var instanceManagerHost = ConfigurationManager.AppSettings["OracleInstanceApi"];
            if (string.IsNullOrEmpty(instanceManagerHost)) return null;
            if (!instanceManagerHost.EndsWith("/")) instanceManagerHost += "/";
            var url = instanceManagerHost + "OracleInstance";
            return ApiClient.Execute<List<OracleInstanceDetails>>(url, HttpMethod.Get);
        }

        public static void SetReserved(OracleInstanceReservationRequest request)
        {

            var instanceManagerHost = ConfigurationManager.AppSettings["OracleInstanceApi"];
            if (string.IsNullOrEmpty(instanceManagerHost)) return;

            if (!instanceManagerHost.EndsWith("/")) instanceManagerHost += "/";
            var url = instanceManagerHost + "OracleInstanceReservation";

            var content = ApiClient.GetHttpContent<OracleInstanceReservationRequest>(request);
            ApiClient.Execute(url, HttpMethod.Put, content);
        }

        [HttpPost]
        public ActionResult UnWhitelist(IISApplication application)
        {
            try
            {
                var whitelistFile = ConfigurationManager.AppSettings["WhitelistXmlPath"];
                var whitelist = XDocument.Load(whitelistFile);

                var buildsNode = whitelist.Descendants("builds").First();

                foreach (var appPool in application.ApplicationPools)
                {
                    var builds = buildsNode.Descendants("build").Where(n => n.Descendants("app").Any(a => a.Attribute("value")?.Value == appPool.Name)).ToList();
                    foreach (var build in builds)
                    {
                        build.Descendants("app").Where(a => a.Attribute("value")?.Value == appPool.Name).Remove();
                        if (!build.HasElements) build.Remove();
                    }
                }

                using (var file = new StreamWriter(whitelistFile))
                {
                    whitelist.Save(file);
                }
                if (application.Name.EndsWith("-O"))
                {
                    var oracleInstances = GetAllOracleInstances();
                    var instance = oracleInstances.FirstOrDefault(i => i.CurrentBuildName == application.Name.Replace("-O", ""));
                    if (instance != null)
                    {
                        SetReserved(new OracleInstanceReservationRequest
                        {
                            Id = instance.Id,
                            Reserve = false
                        });
                    }
                }

                return new { Message = "Application un-whitelisted successfuly." }.ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }

        }



        [HttpGet]
        public ActionResult GetDiskUsage()
        {
            try
            {
                var foldersString = ConfigurationManager.AppSettings["PathsToCheckSize"];
                var paths = foldersString.Split('|');
                var sizes = new List<FolderSize>();

                foreach (var path in paths)
                {
                    sizes.Add(new FolderSize { Path = path, Size = CalculateFolderSize(path) });
                }

                return sizes.ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }
        }

        protected static double CalculateFolderSize(string folder)
        {
            double folderSize = 0;
            try
            {
                //Checks if the path is valid or not
                if (!Directory.Exists(folder))
                    return folderSize;
                try
                {
                    foreach (string file in Directory.GetFiles(folder))
                    {
                        if (System.IO.File.Exists(file))
                        {
                            var finfo = new FileInfo(file);
                            folderSize += finfo.Length;
                        }
                    }

                    foreach (string dir in Directory.GetDirectories(folder))
                        folderSize += CalculateFolderSize(dir);
                }
                catch (NotSupportedException e)
                {

                }
            }
            catch (UnauthorizedAccessException e)
            {

            }
            return folderSize;
        }

        [HttpGet]
        public ActionResult GetOracleInstances()
        {
            try
            {
                var instances = GetAllOracleInstances();
                return instances.Select(i => new { i.Id, i.CurrentBuildName, CurrentBuildDate = i.CurrentBuildDate.ToString("g"), i.DisplayName, i.IsReserved, i.IsDeploying }).ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }
        }

        [HttpPost]
        public ActionResult SetOracleInstanceReserved(int id, bool isReserved)
        {
            try
            {
                SetReserved(new OracleInstanceReservationRequest
                {
                    Id = id,
                    Reserve = isReserved
                });

                return new { Message = $"Succesfully {(isReserved ? "" : "un")}reserved Oracle instance."}.ToJsonResult();

            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }
        }

        private double GetPhysicalMemory()
        {
            ObjectQuery winQuery = new ObjectQuery("SELECT * FROM Win32_OperatingSystem");
            ManagementObjectSearcher searcher = new ManagementObjectSearcher(winQuery);

            double memory = 0;
            foreach (ManagementObject item in searcher.Get())
            {
                memory = double.Parse(item["TotalVirtualMemorySize"].ToString());
            }
            return memory;
        }

        [HttpGet]
        public ActionResult GetUserSesssions()
        {
            try
            {
                TerminalServicesManager manager = new TerminalServicesManager();
                using (ITerminalServer server = manager.GetLocalServer())
                {
                    server.Open();
                    var sessions = server.GetSessions()
                        .Where(s => !string.IsNullOrEmpty(s.UserName))
                        .Select(s => new
                        {
                            User = s.DomainName + @"\" + s.UserName,
                            LoginDate = s.LoginTime?.ToString("g"),
                            State = s.ConnectionState.ToString()
                        });
                    return sessions.ToJsonResult();

                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }
        }
        
        [HttpGet]
        public ActionResult GetSettingValue(string key)
        {
            try
            {
                if (string.IsNullOrEmpty(key))
                {
                    Response.StatusCode = 400;
                    return new { Message = "Key parameter cannot be null or empty." }.ToJsonResult();
                }

                var value = ConfigurationManager.AppSettings[key];
                return new { Message = "SUCCESS", Value = value }.ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }
        }
    }
}
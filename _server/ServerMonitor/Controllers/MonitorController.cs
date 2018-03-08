

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Xml.Linq;
using Cassia;
using LiteDB;
using Microsoft.Web.Administration;
using Microsoft.Win32.TaskScheduler;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    public class MonitorController : Controller
    {
        protected static PerformanceCounter CpuCounter { get; set; }
        private static string DB_PATH => HostingEnvironment.MapPath("~/App_Data/ServerMonitor.db");

        // GET: Monitor
        [HttpGet]
        public ActionResult GetIISApplications()
        {
            try
            {
                var mgr = new ServerManager();
                var appPools = new List<IISAppPool>();
                var sites = mgr.Sites[0].Applications.GroupBy(s => s.ApplicationPoolName)
                    .Select(g => new
                    {
                        PoolName = g.Key,
                        WebApps = g.Select(s =>  s.Path ).ToList()
                    }).ToList();

                foreach (var app in mgr.ApplicationPools)
                {
                    appPools.Add(new IISAppPool
                    {
                        Name = app.Name,
                        State = app.State.ToString(),
                        Apps = sites.FirstOrDefault(s => s.PoolName == app.Name)?.WebApps.ToList()
                    });
                }


                var applications = GroupAppPools(appPools);

                var ignoreList = ConfigurationManager.AppSettings["IISIgnoreList"].Split('|');
                var filteredApps = applications.Where(a => !ignoreList.Contains(a.Name)).ToList();


                var buildsNode = GetWhitelistItems();
                if (buildsNode != null)
                {
                    filteredApps.ForEach(ap => ap.IsWhitelisted = IsWhiteListed(ap.ApplicationPools, buildsNode));
                }

                filteredApps.ForEach(ap => ap.Note = GetBuildNote(ap.Name));

                return filteredApps.ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }

        private static XElement GetWhitelistItems()
        {
            var whitelistFile = ConfigurationManager.AppSettings["WhitelistXmlPath"];
            if (!System.IO.File.Exists(whitelistFile)) return null;
            var whitelist = XDocument.Load(whitelistFile);

            var buildsNode = whitelist.Descendants("builds").First();
            return buildsNode;
        }

        private bool IsWhiteListed(IList<IISAppPool> applicationPools, XElement buildsNode)
        {
            return applicationPools.All(appPool => buildsNode.Descendants("build")
                .Any(n => n.Descendants("app").Any(a => a.Attribute("value")?.Value == appPool.Name)));
        }

        private static List<IISApplication> GroupAppPools(List<IISAppPool> appPools)
        {
            var applications = new List<IISApplication>();
            var regexString = ConfigurationManager.AppSettings["IISAppPoolRegex"];
            var regex = new Regex(regexString);

            foreach (var appPool in appPools)
            {
                var matches = regex.Match(appPool.Name);
                if (matches.Success)
                {
                    var name = string.Empty;

                    for (var i = 1; i < matches.Groups.Count; i++)
                    {
                        name = matches.Groups[i].Value;
                        if (!string.IsNullOrEmpty(name)) break;
                    }

                    if (string.IsNullOrEmpty(name)) continue;

                    var application = applications.FirstOrDefault(a => a.Name == name);
                    if (application == null)
                    {
                        application = new IISApplication
                        {
                            Name = name
                        };
                        applications.Add(application);
                    }

                    application.ApplicationPools.Add(appPool);
                }
            }
            return applications;
        }

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
                    return Json(new { Message = "Application pool not found." }, JsonRequestBehavior.AllowGet);
                }

                pool.Recycle();

                return Json(new { Message = "Application pool succesfully recycled." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
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

                return Json(new { Message = "Application pools stopped successfuly." });
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
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

                return Json(new { Message = "Application pools started successfuly." });
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
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

                return Json(new { Message = "Application whitelisted successfuly." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
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

                return Json(new { Message = "Application un-whitelisted successfuly." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
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

                return Json(sizes, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
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
                return Json(instances.Select(i => new { i.Id, i.CurrentBuildName, CurrentBuildDate = i.CurrentBuildDate.ToString("g"), i.DisplayName, i.IsReserved, i.IsDeploying }), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
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

                return Json(new { Message = $"Succesfully {(isReserved ? "" : "un")}reserved Oracle instance."}, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
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
                    return Json(sessions, JsonRequestBehavior.AllowGet);

                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }

        protected string GetBuildNote(string name)
        {
            using (var db = new LiteDatabase(DB_PATH))
            {
                // Get a collection (or create, if doesn't exist)
                var col = db.GetCollection<BuildNote>("BuildNotes");

                var note = col.Find(c => c.BuildName == name).FirstOrDefault();
                return note?.Note;
            }
        }

        protected void SetBuildNote(string buildName, string note)
        {
            using (var db = new LiteDatabase(DB_PATH))
            {
                // Get a collection (or create, if doesn't exist)
                var col = db.GetCollection<BuildNote>("BuildNotes");
                var buildNote = col.Find(c => c.BuildName == buildName).FirstOrDefault();

                if (buildNote == null)
                {
                    col.Insert(new BuildNote
                    {
                        Id = new Guid(),
                        BuildName = buildName,
                        Note = note
                    });
                }
                else
                {
                    buildNote.Note = note;
                    col.Update(buildNote);
                }

                col.EnsureIndex(x => x.BuildName);
                db.Engine.Commit();
            }
        }

        [HttpPost]
        public ActionResult SaveBuildNote(string name, string value, string pk)
        {
            try
            {
                SetBuildNote(pk, value);
                return Json(new { Message = "Application note saved succesfully." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public ActionResult GetserviceState()
        {
            try
            {
                var serviceUrl = ConfigurationManager.AppSettings["serviceUrl"];
                var serviceUser = ConfigurationManager.AppSettings["serviceUser"];
                var servicePassword = ConfigurationManager.AppSettings["servicePassword"];
                ApiClient.Execute(serviceUrl, HttpMethod.Get, new NetworkCredential(serviceUser, servicePassword));

                return Json(new { Message = "SUCCESS" }, JsonRequestBehavior.AllowGet);
            }
            catch (AggregateException ex)
            {
                Response.StatusCode = 500;
                return Json(new { Message = string.Join("<br/>", ex.InnerExceptions.Select(e => e.Message)), Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetElasticsearchState()
        {
            try
            {
                var elasticUrl = ConfigurationManager.AppSettings["ElasticUrl"];
                var elasticUser = ConfigurationManager.AppSettings["ElasticUser"];
                var elasticPassword = ConfigurationManager.AppSettings["ElasticPassword"];
                ApiClient.Execute(elasticUrl, HttpMethod.Get, new NetworkCredential(elasticUser, elasticPassword));

                return Json(new { Message = "SUCCESS" }, JsonRequestBehavior.AllowGet);
            }
            catch (AggregateException ex)
            {
                Response.StatusCode = 500;
                return Json(new { Message = string.Join("<br/>", ex.InnerExceptions.Select(e => e.Message)), Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
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
                    return Json(new { Message = "Key parameter cannot be null or empty." }, JsonRequestBehavior.AllowGet);
                }

                var value = ConfigurationManager.AppSettings[key];
                return Json(new { Message = "SUCCESS", Value = value }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
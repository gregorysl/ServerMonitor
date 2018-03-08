using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Xml.Linq;
using LiteDB;
using Microsoft.Web.Administration;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    public class IisController : Controller
    {
        private static string DB_PATH => HostingEnvironment.MapPath("~/App_Data/ServerMonitor.db");
        // GET: Monitor
        [HttpGet]
        public ActionResult Get()
        {
            try
            {
                var mgr = new ServerManager();
                var appPools = new List<IISAppPool>();
                var sites = mgr.Sites[0].Applications.GroupBy(s => s.ApplicationPoolName)
                    .Select(g => new
                    {
                        PoolName = g.Key,
                        WebApps = g.Select(s => s.Path).ToList()
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
    }
}
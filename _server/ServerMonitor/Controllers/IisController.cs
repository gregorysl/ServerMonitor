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

        [HttpGet]
        public ActionResult Get()
        {
            try
            {
                var mgr = new ServerManager();
                var iis = mgr.Sites[0].Applications;
                var appPools = mgr.ApplicationPools.Select(x => new IISAppPool
                {
                    Name = x.Name,
                    Running = x.State == ObjectState.Started,
                    Apps = iis.Where(a => a.ApplicationPoolName == x.Name)
                        .Select(s => s.Path.Replace("/", string.Empty)).ToList()
                }).ToList();
                

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
        public ActionResult Toggle(List<string> appPools, bool running)
        {
            try
            {
                var mgr = new ServerManager();
                var pools = mgr.ApplicationPools.Where(app => appPools.Contains(app.Name));

                foreach (var pool in pools)
                {
                    if (running)
                    {
                        pool.Stop();
                    }
                    else
                    {
                        pool.Start();
                    }
                }

                return Json(new { message = "Application pools stopped successfuly." });
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { message = ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
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

    }
}
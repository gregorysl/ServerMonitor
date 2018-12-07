using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Hosting;
using System.Web.Http;
using System.Xml.Linq;
using LiteDB;
using Microsoft.Web.Administration;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    public class IisController : BaseApi
    {
        private static string DbPath => HostingEnvironment.MapPath("~/App_Data/ServerMonitor.db");

        [HttpGet]
        [Route("Iis")]
        public Response Get([FromUri]bool force = false)
        {
            var cacheKey = "GetFilteredApps";
            var response = new Response();
            try
            {
                Log.Debug("GetFilteredApps called.");
                if (force)
                {
                    CacheManager.FlushCache(cacheKey);
                    response.AddSuccessNotification("Flushed IIS cache successfully");
                }
                var filteredApps = CacheManager.GetObjectFromCache(cacheKey, _cacheLifecycle, GetFilteredApps);
                Log.Debug("GetFilteredApps call success.");
                response.Data = filteredApps;
                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.AddErrorNotification(ex.Message,ex.StackTrace);
                return response;
            }
        }

        [HttpPost]
        [Route("IIS/Recycle/{name}")]
        public Response Recycle(string name)
        {
            var response = new Response();
            try
            {
                var mgr = new ServerManager();
                var pool = mgr.ApplicationPools.FirstOrDefault(app => app.Name == name);
                
                if (pool == null)
                {
                    response.AddErrorNotification("Application pool not found.");
                    response.Status = Status.Error;
                    return response;
                }else if(pool.State == ObjectState.Stopped)
                {
                    response.AddErrorNotification("Application pool is not started.");
                    response.Status = Status.Error;
                    return response;
                }

                pool.Recycle();

                response.AddSuccessNotification("Application pool successfully recycled.");
                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }

        }

        private IList<IisApplication> GetFilteredApps()
        {
            var ignoreList = ConfigurationManager.AppSettings["IISIgnoreList"].Split('|');
            var regexString = ConfigurationManager.AppSettings["NewIISAppPoolRegex"];
            var appRoot = ConfigurationManager.AppSettings["AppRootUrl"].EnsureSlash();
            var groupRegex = new Regex(regexString);
            var mgr = new ServerManager();
            var iis = mgr.Sites[0].Applications;

            var filteredApplicationPools = mgr.ApplicationPools.Select(x => x.Name)
                .Where(a => !ignoreList.Contains(a)).ToList();

            var applicationPoolGroupNames = filteredApplicationPools.Where(x => groupRegex.IsMatch(x))
                .Select(x => groupRegex.Match(x).Captures[0].Value).Distinct().ToList();

            var applications = applicationPoolGroupNames.Select(item => new IisApplication
            {
                Name = item,
                Url = $"{appRoot}{item}/",
                ApplicationPools = mgr.ApplicationPools.Where(x => x.Name.StartsWith(item)).Select(x => new IISAppPool
                {
                    Name = x.Name,
                    Running = x.State == ObjectState.Started,
                    Apps = iis.Where(a => a.ApplicationPoolName == x.Name)
                        .Select(s => s.Path.Replace("/", string.Empty)).ToList()
                }).Where(x => x.Apps.Any()).ToList()
            }).ToList();

            var buildsNode = GetWhitelistItems();

            if (buildsNode != null)
            {
                applications.ForEach(ap => ap.Whitelisted = IsWhiteListed(ap.ApplicationPools, buildsNode));
            }

            applications.ForEach(ap => ap.Note = GetBuildNote(ap.Name));
            return applications;
        }
        
        private static XElement GetWhitelistItems()
        {
            var whitelistFile = ConfigurationManager.AppSettings["WhitelistXmlPath"];
            if (!File.Exists(whitelistFile)) return null;
            var whitelist = XDocument.Load(whitelistFile);

            var buildsNode = whitelist.Descendants("builds").First();
            return buildsNode;
        }

        private bool IsWhiteListed(IList<IISAppPool> applicationPools, XElement buildsNode)
        {
            var builds = buildsNode.Descendants("app").Select(x => x.Attribute("value")?.Value);
            var apps = applicationPools.Select(x => x.Name).ToList();
            return builds.Intersect(apps).Count() == apps.Count;
        }

        [HttpPost]
        [Route("Iis/Toggle")]
        public Response Toggle(IssToggleConfig issToggleConfig)
        {
            var response= new Response();
            try
            {
                var mgr = new ServerManager();
                var pools = mgr.ApplicationPools.Where(app => issToggleConfig.AppPools.Contains(app.Name));

                foreach (var pool in pools)
                {
                    var newState = issToggleConfig.Condition ? pool.Stop() : pool.Start();
                }

                var state = issToggleConfig.Condition ? "stopped" : "started";
                response.AddSuccessNotification($"Application pools {state} successfully.");
                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.AddErrorNotification(ex.Message,ex.StackTrace);
                return response;
            }

        }

        [HttpPost]
        public Response WhitelistToggle(IssToggleConfig issToggleConfig)
        {
            var response = new Response();
            try
            {
                var whitelistFile = ConfigurationManager.AppSettings["WhitelistXmlPath"];
                var whitelist = XDocument.Load(whitelistFile);

                var buildsNode = whitelist.Descendants("builds").First();

                if (!issToggleConfig.Condition)
                {
                    foreach (var appPool in issToggleConfig.AppPools)
                    {
                        var poolElement = new XElement("app");
                        poolElement.SetAttributeValue("value", appPool);
                        buildsNode.Add(poolElement);
                    }
                }
                else
                {
                    var builds = buildsNode.Descendants("app")
                        .Where(x => issToggleConfig.AppPools.Contains(x.Attribute("value")?.Value)).ToList();
                    foreach (var build in builds)
                    {
                        build.Remove();
                    }
                }
                
                using (var file = new StreamWriter(whitelistFile))
                {
                    whitelist.Save(file);
                }

                //if (application.Name.EndsWith("-O"))
                //{
                //    var oracleInstances = GetAllOracleInstances();
                //    var instance = oracleInstances.FirstOrDefault(i => i.CurrentBuildName == application.Name.Replace("-O", ""));
                //    if (instance != null)
                //    {
                //        SetReserved(new OracleInstanceReservationRequest
                //        {
                //            Id = instance.Id,
                //            Reserve = true
                //        });
                //    }
                //}
                var function = issToggleConfig.Condition ? "un" : "";
                response.AddSuccessNotification($"Application {function}whitelisted successfully.");
                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }

        }


        protected string GetBuildNote(string name)
        {
            using (var db = new LiteDatabase(DbPath))
            {
                var col = db.GetCollection<BuildNote>("BuildNotes");

                var note = col.Find(c => c.BuildName == name).FirstOrDefault();
                return note?.Note;
            }
        }

        protected void SetBuildNote(string buildName, string note)
        {
            using (var db = new LiteDatabase(DbPath))
            {
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
            }
        }

        [HttpPost]
        [Route("Iis/SaveBuildNote")]
        public Response SaveBuildNote([FromBody]KeyValueData<string> data)
        {
            var response = new Response();
            try
            {
                SetBuildNote(data.Key, data.Value);
                response.AddSuccessNotification("Application note saved succesfully.");
                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }
        }

        [HttpGet]
        public Response GetBuildNotes(string name)
        {
            var response = new Response();
            try
            {
                var buildNote = GetBuildNote(name);
                response.Data = buildNote;
                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }
        }

    }
}
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Hosting;
using System.Web.Http;
using BuildInspect.Data.Entities;
using BuildInspect.Filter;
using LiteDB;
using Microsoft.Web.Administration;
using Newtonsoft.Json;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("IIS")]
    public class IisController : BaseApi
    {
        private readonly string _whitelistPath = HostingEnvironment.MapPath("~/whitelist.json");
        private static string DbPath => HostingEnvironment.MapPath("~/ServerMonitor.db");

        [Route]
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
                response.AddErrorNotification(ex.Message, ex.StackTrace);
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
                }
                else if (pool.State == ObjectState.Stopped)
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

        private IList<BuildEntity> GetFilteredApps()
        {
            var whitelistProvider = new JsonWhitelistProvider(_whitelistPath);
            var buildsProvider = new CommonNameBuildsProvider(Settings.CommonAppName);

            var whitelist = whitelistProvider.GetWhitelist();
            var builds = buildsProvider.GetBuilds().ToList();
            builds.FillAdditionalData(whitelist);
            
            var notes = GetAllBuildNotes();
            builds.ForEach(x=>x.Note = notes.FirstOrDefault(n=>n.BuildName==x.Name)?.Note);

            return builds;
        }
        
        [HttpPost]
        [Route("Iis/Toggle")]
        public Response Toggle(IssToggleConfig issToggleConfig)
        {
            var response = new Response();
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
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }

        }

        [HttpPost]
        [Route("IIS/Whitelist/{name}")]
        public Response WhitelistToggle(string name)
        {
            var response = new Response();
            try
            {
                var whitelistProvider = new JsonWhitelistProvider(_whitelistPath);
                var whitelist = whitelistProvider.GetWhitelist();

                var isWhitelisted = whitelist.Any(x => x == name);
                if (isWhitelisted)
                {
                    whitelist.Remove(name);
                }
                else
                {
                    whitelist.Add(name);
                }

                var json = JsonConvert.SerializeObject(whitelist);
                File.WriteAllText(_whitelistPath, json);

                var function = isWhitelisted ? "un" : "";

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
        
        protected List<BuildNote> GetAllBuildNotes()
        {
            using (var db = new LiteDatabase(DbPath))
            {
                var col = db.GetCollection<BuildNote>("BuildNotes").FindAll().ToList();
                return col;
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
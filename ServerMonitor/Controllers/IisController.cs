using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Hosting;
using System.Web.Http;
using BuildInspect.Data.Entities;
using BuildInspect.Filter;
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

        [Route]
        public Response Get()
        {
            var response = new Response();
            try
            {
                Log.Debug("GetFilteredApps called.");
                var filteredApps = GetFilteredApps();
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
            var buildsProvider = new CommonNameBuildsProvider(Settings.Data.CommonAppName);

            var whitelist = whitelistProvider.GetWhitelist();
            var builds = buildsProvider.GetBuilds().OrderBy(x => x.Name).ToList();
            builds.FillAdditionalData(whitelist);

            var notes = new NoteHelper().GetAll();
            builds.ForEach(x => x.Note = notes.FirstOrDefault(n => n.BuildName == x.Name)?.Note);

            return builds;
        }

        [Route]
        public Response Post(IisAction action)
        {
            var response = new Response();
            switch (action.Action)
            {
                case "Toggle":
                    var mgr = new ServerManager();
                    var buildAppPools = action.Build.Apps.Select(x => x.Pool).ToList();
                    var pools = mgr.ApplicationPools.Where(app => buildAppPools.Contains(app.Name));

                    foreach (var pool in pools)
                    {
                        var newState = pool.State == ObjectState.Started ? pool.Stop() : pool.Start();
                    }

                    response.AddSuccessNotification($"Application pools toggled successfully.");
                    break;
                case "Whitelist":
                    var whitelistProvider = new JsonWhitelistProvider(_whitelistPath);
                    var whitelist = whitelistProvider.GetWhitelist();

                    var buildName = action.Build.Name;
                    var isWhitelisted = whitelist.Any(x => x == buildName);
                    if (isWhitelisted)
                    {
                        whitelist.Remove(buildName);
                    }
                    else
                    {
                        whitelist.Add(buildName);
                    }

                    var json = JsonConvert.SerializeObject(whitelist);
                    File.WriteAllText(_whitelistPath, json);

                    var function = isWhitelisted ? "un" : "";

                    response.AddSuccessNotification($"Application {function}whitelisted successfully.");
                    break;
                case "Note":
                    var notes = new NoteHelper();
                    notes.Save(action.Build.Name, action.Build.Note);
                    response.AddSuccessNotification("Application note saved succesfully.");
                    break;
            }

            return response;
        }
    }
}
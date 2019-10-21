using System;
using System.Linq;
using System.Web.Http;
using ServerMonitor.Helpers;
using ServerMonitor.Entities;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("IIS")]
    public class IisController : BaseApi
    {
        private readonly IisHandler _handler;
        public IisController()
        {
            _handler = new IisHandler();
        }

        [Route]
        public Response Get()
        {
            var response = new Response();
            try
            {
                if (string.IsNullOrWhiteSpace(Settings.Data.CommonAppName))
                {
                    response.AddErrorNotification("CommonAppName setting is missing");
                    return response;
                }
                Log.Debug("GetFilteredApps called.");
                response.Data = _handler.GetFilteredApps();
                Log.Debug("GetFilteredApps call success.");
                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }
        }

        [Route]
        public Response Post(string name)
        {
            var response = new Response();
            try
            {
                var result = _handler.RecycleAppPool(name);
                if (result)
                {
                    response.AddSuccessNotification("Application pool successfully recycled.");
                    return response;
                }

                response.AddErrorNotification($"Error trying to recycle {name}");
                response.Status = Status.Error;
                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }

        }

        [Route]
        public Response Post(IisAction action)
        {
            var response = new Response();
            switch (action.Action)
            {
                case "Toggle":
                    
                    var buildAppPools = action.Build.Apps.Select(x => x.Pool).ToList();
                    _handler.Toggle(buildAppPools);

                    response.AddSuccessNotification("Application pools toggled successfully.");
                    break;
                case "Whitelist":
                    var whitelistProvider = new WhitelistHandler().Provider;
                    var isWhitelisted = whitelistProvider.Toggle(action.Build.Name);
                    var function = isWhitelisted ? "" : "un";

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
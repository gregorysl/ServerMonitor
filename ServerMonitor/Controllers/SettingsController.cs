using ServerMonitor.Entities;
using System.Web.Http;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("Settings")]
    public class SettingsController : BaseApi
    {
        [Route]
        public Response Get([FromUri]bool force = false)
        {
            if (force)
            {
                Settings.Get();
            }
            var response = new Response {Data = Settings.Data};
            return response;
        }

        [Route]
        public Response Put(JsonSettings settings)
        {
            Settings.Save(settings);
            var response = new Response();
            response.AddSuccessNotification("Settings saved successfully");
            return response;
        }
    }
}
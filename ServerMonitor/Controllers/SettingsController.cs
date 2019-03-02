using ServerMonitor.Helpers;
using ServerMonitor.Models;
using System.Web.Http;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("Settings")]
    public class SettingsController : BaseApi
    {
        [Route]
        public Response Get()
        {
            var response = new Response();
            response.Data = Settings;
            return response;

        }
    }
}
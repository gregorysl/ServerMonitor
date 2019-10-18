using System.Linq;
using ServerMonitor.Helpers;
using ServerMonitor.Entities;
using System.Web.Http;

namespace ServerMonitor.Controllers
{   
    [RoutePrefix("Cleaner")]
    public class CleanerController : BaseApi
    {
        [Route]
        public Response Get()
        {
            var response = new Response();
            var iisHandler = new IisHandler();
            response.Data = iisHandler.GetBuildsToClean().SelectMany(x=>x.Apps).Select(x=>x.Name).ToList();
            return response;
        }
    }
}
using BuildInspect.Data;
using BuildInspect.Filter;
using ServerMonitor.Helpers;
using ServerMonitor.Models;
using System.Linq;
using System.Web.Hosting;
using System.Web.Http;

namespace ServerMonitor.Controllers
{   
    [RoutePrefix("Cleaner")]
    public class CleanerController : BaseApi
    {
        private string _whitelistPath = HostingEnvironment.MapPath("~/whitelist.json");
        [Route]
        public Response Get()
        {
            var response = new Response();

            var buildsProvider = new CommonNameBuildsProvider(Settings.CommonAppName);
            var whitelistProvider = new JsonWhitelistProvider(_whitelistPath);

            var filterHandler = new FilterHandler(whitelistProvider, buildsProvider);
            var buildsToRemove = filterHandler.Execute(Settings.Cleaner);

            response.Data = buildsToRemove.SelectMany(x=>x.Apps).Select(x=>x.Name).ToList();
            return response;
        }


        [Route]
        public Response Put(FilterInput cleanerSettings)
        {
            var response = new Response();
            Settings.Cleaner = cleanerSettings;
            new SettingsHelper().Save(Settings);
            return response;
        }
    }
}
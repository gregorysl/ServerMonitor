using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("Links")]
    public class LinksController : BaseApi
    {

        [Route]
        public Response Get()
        {
            var response = new Response();
            var links = Settings.Links;
            if (links == null)
            {
                response.Status = Status.Error;
                response.AddErrorNotification("Configuration of links missing");
                return response;
            }

            response.Data = links;
            return response;
        }

        [Route]
        public async Task<Response> Post(string url)
        {
            var response = new Response();
            var links = Settings.Links;
            if (links == null)
            {
                response.Status = Status.Error;
                response.AddErrorNotification("Configuration of links missing");
                return response;
            }

            var sentLinkData = links.First(x => x.Url == url);
            var data = await Task.Run(() => LinksHelper.GetLinkStatus(sentLinkData));

            response.Data = data;
            return response;
        }

    }
}
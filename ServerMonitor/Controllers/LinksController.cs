using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    public class LinksController : BaseApi
    {
        private IEnumerable<UncheckedLink> _linkCollection;

        // GET api/<controller>
        public Response Get()
        {
            var response = new Response();
            _linkCollection = Settings.Links;
            if (_linkCollection == null)
            {
                response.Status = Status.Error;
                response.AddErrorNotification("Configuration of links missing");
                return response;
            }

            var links = CacheManager.GetObjectFromCache("Links", _cacheLifecycle, GetLinksStatus);

            response.Data = links;
            return response;
        }

        private IList<Link> GetLinksStatus()
        {
            var links = new List<Link>();
            var tasksToWait = _linkCollection.Select(link => Task.Run(() => { links.Add(LinksHelper.GetLinkStatus(link)); })).ToArray();
            Task.WaitAll(tasksToWait.Where(t => t.Status == TaskStatus.Running).ToArray());

            return links.OrderBy(x=>x.Name).ToList();
        }
    }
}
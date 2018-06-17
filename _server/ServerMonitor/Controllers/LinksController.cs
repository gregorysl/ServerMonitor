using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    public class LinksController : BaseApi
    {
        private IEnumerable<LinkItem> _linkCollection;
        // GET api/<controller>
        public Response Get()
        {
            var response = new Response();
            _linkCollection = LinksHelper.GetLinks("links");
            if (_linkCollection == null)
            {
                response.Status = Status.Error;
                response.AddErrorNotification("Configuration of links missing");
                return response;
            }

            var links = GetLinksStatus();//CacheManager.GetObjectFromCache("Links", _cacheLifecycle, GetLinksStatus);

            response.Data = links;
            return response;
        }

        private  List<Link> GetLinksStatus()
        {
            var links = _linkCollection.AsParallel().Select(GetLinkStatus).ToList();


            return links;
        }

        private static Link GetLinkStatus(LinkItem item)
        {
            var credentials = !string.IsNullOrWhiteSpace(item.Username) && !string.IsNullOrWhiteSpace(item.Password)
                ? new NetworkCredential(item.Username, item.Password)
                : null;
            var link = item.FromConfig();

            try
            {
                using (var handler = new HttpClientHandler {Credentials = credentials})
                {
                    using (var client = new HttpClient(handler))
                    {
                        ServicePointManager.ServerCertificateValidationCallback +=
                            (sender, cert, chain, sslPolicyErrors) => true;
                        client.BaseAddress = new Uri(item.Url, UriKind.Absolute);
                        client.Timeout = TimeSpan.FromSeconds(30);
                        client.DefaultRequestHeaders.Accept.Clear();
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        var linkResponse = client.GetAsync(client.BaseAddress).Result;
                        link.Message = linkResponse.StatusCode.ToString();
                        link.Working = linkResponse.IsSuccessStatusCode;
                    }
                }
            }
            catch (Exception ex)
            {
                link.Working = false;
                link.Message = GatherExceptions(ex);
            }

            return link;
        }


        public static string GatherExceptions(Exception e)
        {
            var exception = $"{e.Message}\\r\\n";
            return e.InnerException != null ? exception + GatherExceptions(e.InnerException) : exception;
        }
    }
}
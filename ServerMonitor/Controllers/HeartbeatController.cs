using System.Web.Http;
using System.Web.Http.Results;
using ServerMonitor.Entities;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("heartbeat")]
    public class HeartbeatController : ApiController
    {
        public Response Get()
        {
            var response = new Response{Status = Status.Success};
            return response;
        }

    }
}
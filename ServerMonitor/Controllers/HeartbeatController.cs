using System.Web.Http;
using System.Web.Http.Results;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("heartbeat")]
    public class HeartbeatController : ApiController
    {
        public OkResult Get()
        {
            return Ok();
        }

    }
}
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ServerMonitor.Oracle;

namespace ServerMonitor.Controllers
{
    public class OracleInstanceReservationController : ApiController
    {
        protected readonly OracleInstanceBl OracleInstanceBl;

        public OracleInstanceReservationController()
        {
            OracleInstanceBl = new OracleInstanceBl();
        }

        public HttpResponseMessage Get()
        {
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "This operation is not allowed.");
        }
        
        public void Put([FromBody] OracleInstanceReservationRequest value)
        {
            OracleInstanceBl.ChangeInstanceReservation(value.Id, value.Reserve);
        }
    }
}
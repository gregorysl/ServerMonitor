using System.Net;
using System.Net.Http;
using System.Web.Http;
using ServerMonitor.Oracle;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("OracleInstanceReservation")]
    public class OracleInstanceReservationController : ApiController
    {
        private readonly OracleInstanceBl _oracleInstanceBl;

        public OracleInstanceReservationController()
        {
            _oracleInstanceBl = new OracleInstanceBl();
        }

        [Route]
        public HttpResponseMessage Get()
        {
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "This operation is not allowed.");
        }
        
        [Route]
        public void Put([FromBody] OracleInstanceReservationRequest value)
        {
            _oracleInstanceBl.ChangeInstanceReservation(value.Id, value.Reserve);
        }
    }
}
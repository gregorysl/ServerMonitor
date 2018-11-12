using System.Net;
using System.Net.Http;
using System.Web.Http;
using ServerMonitor.Oracle;

namespace ServerMonitor.Controllers
{
    public class OracleInstanceReservationController : ApiController
    {
        protected readonly OracleInstanceBl _oracleInstanceBl;

        public OracleInstanceReservationController()
        {
            _oracleInstanceBl = new OracleInstanceBl();
        }

        // GET: api/OracleDeployment
        public HttpResponseMessage Get()
        {
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "This operation is not allowed.");
        }

        // POST: api/OracleDeployment
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/OracleDeployment/5
        public void Put([FromBody] OracleInstanceReservationRequest value)
        {
            _oracleInstanceBl.ChangeInstanceReservation(value.Id, value.Reserve);
        }

        // DELETE: api/OracleDeployment/5
        public void Delete(int id)
        {
        }

        // OPTIONS http-verb handler
        public HttpResponseMessage OptionsUser()
        {
            var response = new HttpResponseMessage { StatusCode = HttpStatusCode.OK };
            return response;
        }
    }
}
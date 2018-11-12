using System.Net;
using System.Net.Http;
using System.Web.Http;
using ServerMonitor.Oracle;

namespace ServerMonitor.Controllers
{
    public class OracleInstanceController : ApiController
    {
        protected readonly OracleInstanceBl _oracleInstanceBl;

        public OracleInstanceController()
        {
            _oracleInstanceBl = new OracleInstanceBl();
        }

        // GET: api/OracleInstance
        public HttpResponseMessage Get()
        {
            var instances = _oracleInstanceBl.GetAllInstances();

            if (instances != null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, instances);
            }

            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "We cannot find any available oracle instance.");
        }

        // POST: api/OracleInstance
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/OracleInstance/5
        public void Put([FromBody] string value)
        {
        }

        // DELETE: api/OracleInstance/5
        public void Delete(int id)
        {
        }
    }
}
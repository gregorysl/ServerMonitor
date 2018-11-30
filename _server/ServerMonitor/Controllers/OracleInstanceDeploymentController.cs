using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ServerMonitor.Oracle;

namespace ServerMonitor.Controllers
{
    public class OracleInstanceDeploymentController : ApiController
    {
        protected readonly OracleInstanceBl _oracleInstanceBl;

        public OracleInstanceDeploymentController()
        {
            _oracleInstanceBl = new OracleInstanceBl();
        }

        // GET: api/OracleDeployment
        public HttpResponseMessage Get()
        {
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "This operation is not allowed.");
        }

        // GET: api/OracleInstance
        [Route("OracleInstanceDeployment/{buildServerName}")]
        public HttpResponseMessage Get(string buildServerName)
        {
            var instance = _oracleInstanceBl.GetAvailableInstance(buildServerName);

            if (instance != null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, instance);
            }

            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "We cannot find any available oracle instance.");
        }

        // POST: api/OracleDeployment
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/OracleDeployment/5
        public HttpResponseMessage Put([FromBody] OracleInstanceDeploymentRequest value)
        {
            try
            {

                bool result = _oracleInstanceBl.ChangeInstanceDeployInProgress(value.Id, value.Reserve, value.BuildName);

                if (result)
                {
                    return Request.CreateResponse(HttpStatusCode.OK);
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "The requested instance could not be reserved for deployment.");
                }
            }
            catch (Exception)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "There was a problem processing the request.");
            }
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
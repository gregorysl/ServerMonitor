using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ServerMonitor.Oracle;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("OracleInstanceDeployment")]
    public class OracleInstanceDeploymentController : ApiController
    {
        private readonly OracleInstanceBl _oracleInstanceBl;

        public OracleInstanceDeploymentController()
        {
            _oracleInstanceBl = new OracleInstanceBl();
        }

        [Route("{buildServerName}")]
        public HttpResponseMessage Get(string buildServerName)
        {
            var instance = _oracleInstanceBl.GetAvailableInstance(buildServerName);

            return instance != null
                ? Request.CreateResponse(HttpStatusCode.OK, instance)
                : Request.CreateErrorResponse(HttpStatusCode.NotFound, "We cannot find any available oracle instance.");
        }

        [Route]
        public HttpResponseMessage Put([FromBody] OracleInstanceDeploymentRequest value)
        {
            try
            {
                var result = _oracleInstanceBl.ChangeInstanceDeployInProgress(value.Id, value.Reserve, value.BuildName);

                return result
                    ? Request.CreateResponse(HttpStatusCode.OK)
                    : Request.CreateErrorResponse(HttpStatusCode.NotFound,
                        "The requested instance could not be reserved for deployment.");
            }
            catch (Exception)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "There was a problem processing the request.");
            }
        }
    }
}
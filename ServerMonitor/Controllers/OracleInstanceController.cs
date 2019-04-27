using System;
using System.Web.Http;
using ServerMonitor.Helpers;
using ServerMonitor.Models;
using ServerMonitor.Oracle;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("OracleInstance")]
    public class OracleInstanceController : BaseApi
    {
        private readonly OracleInstanceBl OracleInstanceBl;

        public OracleInstanceController()
        {
            OracleInstanceBl = new OracleInstanceBl();
        }

        [Route]
        public Response Get()
        {
            var response = new Response();
            try
            {

                var isEnabled = Settings.IsOracleInstanceManagerEnabled;
                if (isEnabled)
                {
                    Log.Debug("GetAllInstances called.");
                    var instances = OracleInstanceBl.GetAllInstances();
                    Log.Debug("GetAllInstances call success.");
                    response.Data = instances;
                }
                else
                {
                    response.Data = false;
                }

                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }
        }
    }
}
using System;
using System.Web.Http;
using ServerMonitor.Entities;
using ServerMonitor.Oracle;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("OracleInstance")]
    public class OracleInstanceController : BaseApi
    {
        private readonly OracleInstanceBl _oracleInstanceBl;

        public OracleInstanceController()
        {
            _oracleInstanceBl = new OracleInstanceBl(Settings);
        }

        [Route]
        public Response Get()
        {
            var response = new Response();
            try
            {

                var isEnabled = Settings.Data.IsOracleInstanceManagerEnabled;
                if (isEnabled)
                {
                    Log.Debug("GetAllInstances called.");
                    var instances = _oracleInstanceBl.GetAllInstances();
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
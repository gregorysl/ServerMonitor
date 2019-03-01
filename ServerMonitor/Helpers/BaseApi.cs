using System;
using System.Web.Http;
using System.Web.Query.Dynamic;
using log4net;

namespace ServerMonitor.Helpers
{
    public class BaseApi : ApiController
    {
        protected static readonly ILog Log = LogManager.GetLogger(typeof(BaseApi));
        protected static readonly JsonSettings Settings = new SettingsHelper().Get();

        protected int _cacheLifecycle
        {
            get
            {
                try
                {
                    return Settings.CacheInSeconds;
                }
                catch (Exception ex)
                {
                    Log.Error(ex);
                    throw new ParseException("Error parsing CacheInSeconds appSetting. Value has to be integer.", 0);
                }
            }
        }
    }
}
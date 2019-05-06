using System.Web.Http;
using log4net;

namespace ServerMonitor.Helpers
{
    public class BaseApi : ApiController
    {
        protected static readonly ILog Log = LogManager.GetLogger(typeof(BaseApi));
        protected readonly SettingsHandler Settings = SettingsHandler.Instance;
    }
}
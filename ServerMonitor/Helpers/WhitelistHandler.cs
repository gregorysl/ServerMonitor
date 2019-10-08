using BuildInspect.Data;
using BuildInspect.Data.Interfaces;
using BuildInspect.Filter;

namespace ServerMonitor.Helpers
{
    public class WhitelistHandler
    {
        public IWhitelistProvider Provider { get; set; }
        public WhitelistHandler()
        {
            var settings = SettingsHandler.Instance.Data;
            Provider = settings.Cleaner.WhitelistType == WhitelistType.Xml
                ? new XmlWhitelistProvider(settings.Cleaner.XmlWhitelistPath)
                : (IWhitelistProvider) new JsonWhitelistProvider(settings.Cleaner.JsonWhitelistPath);
        }
    }
}
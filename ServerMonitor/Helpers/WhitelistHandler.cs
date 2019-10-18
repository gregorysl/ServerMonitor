
using ServerMonitor.Entities;
using ServerMonitor.Interfaces;

namespace ServerMonitor.Helpers
{
    public class WhitelistHandler
    {
        public IWhitelistProvider Provider { get; set; }
        public WhitelistHandler()
        {
            var settings = SettingsHandler.Instance.Data;
            Provider = settings.Cleaner.WhitelistType == WhitelistType.Xml
                ? (IWhitelistProvider) new XmlWhitelistProvider(settings.Cleaner.XmlWhitelistPath)
                : (IWhitelistProvider) new JsonWhitelistProvider(settings.Cleaner.JsonWhitelistPath);
        }
    }
}
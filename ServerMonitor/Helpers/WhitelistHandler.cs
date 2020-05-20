
using ServerMonitor.Entities;
using ServerMonitor.Interfaces;

namespace ServerMonitor.Helpers
{
    public class WhitelistHandler
    {
        public IWhitelistProvider Provider { get
        {
            var settings = SettingsHandler.Instance.Data;
            return settings.Cleaner.WhitelistType == WhitelistType.Xml
                ? new XmlWhitelistProvider(settings.Cleaner.XmlWhitelistPath)
                : (IWhitelistProvider)new JsonWhitelistProvider(settings.Cleaner.JsonWhitelistPath);
            } }
        public WhitelistHandler()
        {
        }
    }
}
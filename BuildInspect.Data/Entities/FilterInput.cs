using Newtonsoft.Json;

namespace BuildInspect.Data
{
    //[JsonObject(ItemNullValueHandling = NullValueHandling.Include)]
    [JsonObject]
    public class FilterInput
    {
        public bool UseWhiteList { get; set; }
        public int? BeforeDays { get; set; }
        public int? ExcludeNLast { get; set; }
        public string XmlWhitelistPath { get; set; }
        public string JsonWhitelistPath { get; set; }
        public WhitelistType WhitelistType { get; set; } = WhitelistType.Json;
    }

    public enum WhitelistType
    {
        Xml,
        Json
    }
}

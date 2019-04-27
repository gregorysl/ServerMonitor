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
    }
}

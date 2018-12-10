using Newtonsoft.Json;

namespace ServerMonitor.Helpers
{
    [JsonObject(MemberSerialization.OptIn)]
    public class KeyValueData<T>
    {
        [JsonProperty("key")]
        public string Key { get; set; }
        [JsonProperty("value")]
        public T Value { get; set; }
    }
}
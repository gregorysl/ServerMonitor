using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ServerMonitor.Models
{
    public class Response
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public Status Status { get; set; }
        public object Data { get; set; }
        public List<Notification> Notifications { get; set; } = new List<Notification>();
    }

    public class Notification
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public Status Status { get; set; }
        public string Message { get; set; }
        public string MessageDetails { get; set; }
    }

    public enum Status
    {
        Success,
        Error
    }
}
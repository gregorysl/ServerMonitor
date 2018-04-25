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

        public void AddSuccessNotification(string message, string messageDetails = "")
        {
            AddNotification(Status.Success, message, messageDetails);
        }

        public void AddErrorNotification(string message, string messageDetails = "")
        {
            AddNotification(Status.Success, message, messageDetails);
        }

        private void AddNotification(Status status, string message, string messageDetails)
        {
            Notifications.Add(new Notification
            {
                Status = status,
                Message = message,
                MessageDetails = messageDetails
            });
        }
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
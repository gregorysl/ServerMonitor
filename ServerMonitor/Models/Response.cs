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
            Status = Status.Error;
            AddNotification(Status.Error, message, messageDetails);
        }

        private void AddNotification(Status status, string message, string messageDetails)
        {
            Notifications.Add(new Notification
            {
                Status = status,
                Message = message,
                MessageDetail = messageDetails
            });
        }
    }

    public class Notification
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public Status Status { get; set; } = Status.Success;
        public string Message { get; set; }
        public string MessageDetail { get; set; }
    }

    public enum Status
    {
        Success,
        Error
    }
}
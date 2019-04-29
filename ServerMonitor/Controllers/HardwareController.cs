using System;
using System.Collections.Generic;
using System.Web.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("Hardware")]
    public class HardwareController : BaseApi
    {
        [HttpGet]
        public Response Get()
        {
            var response = new Response();
            try
            {
                var hardwareManager = new HardwareManager();
                var hardware = CacheManager.GetObjectFromCache("IISApplications", _cacheLifecycle, hardwareManager.GetHardware);
                response.Data = hardware;
                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.Status = Status.Error;
                response.AddErrorNotification(ex.Message,ex.StackTrace);
                return response;
            }
        }

        [Route("GetAll")]
        public Response GetAll()
        {
            var response = new Response();
            var hardwareList = new List<Hardware>();

            var config = Settings.HardwareList;

            if (config == null)
            {
                response.Status = Status.Error;
                response.AddErrorNotification("Configuration of hardwareList missing");
                return response;
            }

            foreach (ServerData link in config)
            {
                var linkUrl = $"{link.Url.EnsureSlash()}hardware/get";
                var responseItem = ApiClient.Get<Response>(linkUrl);
                if (responseItem.Status == Status.Success)
                {
                    var innerResponse = (Response) responseItem.Data;
                    response.Notifications.AddRange(innerResponse.Notifications);
                    if (innerResponse.Status == Status.Success)
                    {
                        var data = ((JObject) innerResponse.Data).ToObject<Hardware>();
                        hardwareList.Add(data);
                    }
                }
                response.Notifications.AddRange(responseItem.Notifications);
            }

            response.Data = hardwareList;
            return response;
        }
    }
    [JsonObject(MemberSerialization.OptIn)]
    public class Hardware
    {
        [JsonProperty("key")]
        public string Name { get; set; }
        [JsonProperty("data")]
        public List<Data<double>> Data { get; set; }
    }
    [JsonObject(MemberSerialization.OptIn)]
    public class Data<T>
    {
        [JsonProperty("key")]
        public string Name { get; set; }
        [JsonProperty("value")]
        public T Value { get; set; }
        [JsonProperty("text")]
        public string Text { get; set; }
    }

}
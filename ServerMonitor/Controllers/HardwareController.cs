using System;
using System.Collections.Generic;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using ServerMonitor.Helpers;
using ServerMonitor.Entities;

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
                response.Data = new HardwareManager().GetHardware();
                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.ResponseStatus = Status.Error;
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }
        }

        [Route("GetAll")]
        public Response GetAll()
        {
            var response = new Response();
            var hardwareList = new List<Hardware>();

            var config = Settings.Data.HardwareList;

            if (config == null)
            {
                response.ResponseStatus = Status.Error;
                response.AddErrorNotification("Configuration of hardwareList missing");
                return response;
            }

            foreach (ServerData link in config)
            {
                var linkUrl = $"{link.Url.EnsureSlash()}hardware/get";
                var responseItem = ApiClient.Get<Response>(linkUrl);
                if (responseItem.ResponseStatus == Status.Success)
                {
                    var innerResponse = (Response) responseItem.Data;
                    response.Notifications.AddRange(innerResponse.Notifications);
                    if (innerResponse.ResponseStatus == Status.Success)
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
}
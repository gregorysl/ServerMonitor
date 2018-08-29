using System;
using System.Collections.Generic;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using ServerMonitor.Helpers;
using ServerMonitor.Models;
using static ServerMonitor.Helpers.HardwareManager;

namespace ServerMonitor.Controllers
{
    public class HardwareController : BaseApi
    {
        [HttpGet]
        public Response Get()
        {
            var response = new Response();
            try
            {
                var hardware = CacheManager.GetObjectFromCache("IISApplications", _cacheLifecycle, GetHardware);
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

        [HttpGet]
        [Route("Hardware/GetAll")]
        public Response GetAll()
        {
            var response = new Response();
            var harwareList = new List<Hardware>();

            var config = LinksHelper.GetLinks("hardwareList");

            if (config == null)
            {
                response.Status = Status.Error;
                response.AddErrorNotification("Configuration of hardwareList missing");
                return response;
            }

            foreach (LinkItem link in config)
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
                        harwareList.Add(data);
                    }
                }
                response.Notifications.AddRange(responseItem.Notifications);
            }

            response.Data = harwareList;
            return response;
        }
    }

}
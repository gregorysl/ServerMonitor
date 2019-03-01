using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web.Http;
using Microsoft.VisualBasic.Devices;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    public class HardwareController : BaseApi
    {
        protected static PerformanceCounter CpuCounter { get; set; }

        private readonly ComputerInfo _computerInfo = new ComputerInfo();
        private readonly DriveInfo _driveInfo = DriveInfo.GetDrives().First(x => x.Name == "C:\\");

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

        private Hardware GetHardware()
        {
            var hardware = new Hardware
            {
                Name = Environment.MachineName,
                Data = new List<Data<double>>
                {
                    new Data<double> {Name = "CPU", Value = CpuUsage()},
                    new Data<double> {Name = "RAM", Value = MemoryUsage(), Text = TotalMemory().ToString()},
                    new Data<double> {Name = "HDD", Value = DiskUsage(), Text = TotalDiskSpace().ToString()}
                }
            };
            return hardware;
        }

        [HttpGet]
        [Route("Hardware/GetAll")]
        public Response GetAll()
        {
            var response = new Response();
            var harwareList = new List<Hardware>();

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
                        harwareList.Add(data);
                    }
                }
                response.Notifications.AddRange(responseItem.Notifications);
            }

            response.Data = harwareList;
            return response;
        }

        private static double CpuUsage()
        {
            if (CpuCounter == null)
            {
                CpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");
            }
            return Math.Round(CpuCounter.NextValue());
        }

        private double MemoryUsage()
        {
            var availableMemory = _computerInfo.AvailablePhysicalMemory;
            var allMemory = TotalMemory();
            var usedMemory = allMemory - availableMemory;
            var usage = usedMemory * 100 / allMemory;

            return Math.Round((double)usage);
        }
        public ulong TotalMemory()
        {
            return _computerInfo.TotalPhysicalMemory;
        }

        public long TotalDiskSpace()
        {
            return _driveInfo.TotalSize;
        }

        private double DiskUsage()
        {
            return _driveInfo.TotalFreeSpace * 100 / _driveInfo.TotalSize;
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
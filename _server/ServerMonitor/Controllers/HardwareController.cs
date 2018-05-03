using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Management;
using System.Web.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ServerMonitor.Helpers;
using ServerMonitor.Models;
using ComputerInfo = Microsoft.VisualBasic.Devices.ComputerInfo;

namespace ServerMonitor.Controllers
{
    public class HardwareController : ApiController
    {
        protected static PerformanceCounter CpuCounter { get; set; }

        private readonly ComputerInfo _computerInfo = new ComputerInfo();

        [HttpGet]
        public Response Get()
        {
            var response = new Response();
            try
            {
                var hardware = new Hardware
                {
                    Name = ComputerName(),
                    Data = new List<Data<double>>
                    {
                        new Data<double> {Name = "CPU", Value = CpuUsage()},
                        new Data<double> {Name = "RAM", Value = MemoryUsage()},
                        new Data<double> {Name = "HDD", Value = DiskUsage()}
                    }
                };
                response.Data = hardware;
                return response;
            }
            catch (Exception ex)
            {
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
            var links = new List<Hardware>();
            var config = ConfigurationManager.GetSection("hardwareList") as LinksConfigSection;

            if (config == null) return null;
            foreach (LinkItem link in config.Instances)
            {
                var linkUrl = $"{link.Url.EnsureSlash()}hardware/get";
                var responseItem = ApiClient.Get<Response>(linkUrl);
                if (responseItem.Status == Status.Success)
                {
                    var innerResponse = (Response) responseItem.Data;
                    response.Notifications.AddRange(innerResponse.Notifications);
                    var data = ((JObject) innerResponse.Data).ToObject<Hardware>();
                    links.Add(data);
                }
                response.Notifications.AddRange(responseItem.Notifications);
            }

            response.Data = links;
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
            var allMemory = _computerInfo.TotalPhysicalMemory;
            var usedMemory = allMemory - availableMemory;
            var usage = usedMemory * 100 / allMemory;

            return Math.Round((double)usage);
        }

        private double DiskUsage()
        {
            var p = new PerformanceCounter("LogicalDisk", "% Free Space", "C:");
            return Math.Round(p.NextValue());
        }

        private string ComputerName()
        {
            ManagementClass mc = new ManagementClass("Win32_ComputerSystem");
            ManagementObjectCollection moc = mc.GetInstances();
            foreach (var item in moc)
            {
                return ((ManagementObject)item).Properties["DNSHostName"].Value.ToString()+DateTime.Now.Millisecond;
            }

            return "";
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
    }

}
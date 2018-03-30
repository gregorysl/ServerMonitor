using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Management;
using System.Web.Http;
using Newtonsoft.Json;
using ServerMonitor.Helpers;
using ComputerInfo = Microsoft.VisualBasic.Devices.ComputerInfo;

namespace ServerMonitor.Controllers
{
    public class HardwareController : ApiController
    {
        protected static PerformanceCounter CpuCounter { get; set; }

        private readonly ComputerInfo _computerInfo = new ComputerInfo();

        [HttpGet]
        public object GetHardware()
        {
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
                
                return hardware;
            }
            catch (Exception ex)
            {
                return new { ex.Message, Exception = ex.StackTrace };
            }
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
            foreach (ManagementObject item in moc)
            {
                return item.Properties["DNSHostName"].Value.ToString();
            }

            return "";
        }
    }
    [JsonObject(MemberSerialization.OptIn)]
    public class Hardware
    {
        [JsonProperty("key")]
        public object Name { get; set; }
        [JsonProperty("data")]
        public List<Data<double>> Data { get; set; }
    }
    [JsonObject(MemberSerialization.OptIn)]
    public class Data<T>
    {
        [JsonProperty("key")]
        public object Name { get; set; }
        [JsonProperty("value")]
        public T Value { get; set; }
    }

}
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Management;
using System.Web.Mvc;
using Newtonsoft.Json;
using ServerMonitor.Helpers;
using ComputerInfo = Microsoft.VisualBasic.Devices.ComputerInfo;

namespace ServerMonitor.Controllers
{
    public class HardwareController : Controller
    {
        protected static PerformanceCounter CpuCounter { get; set; }

        private readonly ComputerInfo _computerInfo = new ComputerInfo();

        [HttpGet]
        public ActionResult GetHardware()
        {
            try
            {
                var hardware = new Hardware
                {
                    Name = ComputerName(),
                    Data = new List<Tuple<string, string>>
                    {
                        new Tuple<string, string>("CPU", CpuUsage() +""),
                        new Tuple<string, string>("RAM", MemoryUsage() +""),
                        new Tuple<string, string>("HDD", DiskUsage() +"")

                    }
                };
                var usage = CpuUsage();

                return Json(hardware, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
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

    public class Hardware
    {
        public string Name { get; set; }
        public List<Tuple<string, string>> Data { get; set; }
    }

}
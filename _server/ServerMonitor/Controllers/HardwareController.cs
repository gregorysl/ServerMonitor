using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Management;
using System.Web.Mvc;

namespace ServerMonitor.Controllers
{
    public class HardwareController : Controller
    {
        protected static PerformanceCounter CpuCounter { get; set; }

        public Microsoft.VisualBasic.Devices.ComputerInfo ComputerInfo = new Microsoft.VisualBasic.Devices.ComputerInfo();

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
        [HttpGet]
        public ActionResult GetHardware1()
        {
            try
            {
                var b = ComputerInfo.AvailablePhysicalMemory;
                var a = ComputerInfo.TotalPhysicalMemory;

                var d = ComputerInfo.AvailableVirtualMemory;
                var dd = ComputerInfo.TotalVirtualMemory;
                var hardware = new Hardware
                {
                    Name = ComputerName(),
                    Data = new List<Tuple<string, string>>
                    {
                        new Tuple<string, string>("AvailablePhysicalMemory", b +""),
                        new Tuple<string, string>("TotalPhysicalMemory",a +""),
                        new Tuple<string, string>("AvailableVirtualMemory",d +""),
                        new Tuple<string, string>("TotalVirtualMemory", dd +"")

                    }
                };

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
            var availableMemory = ComputerInfo.AvailablePhysicalMemory;
            var allMemory = ComputerInfo.TotalPhysicalMemory;
            var usedMemory = allMemory - availableMemory;
            var usage = (usedMemory * 100) / allMemory;

            return Math.Round((double)usage);
        }
        private double DiskUsage()
        {
            var p = new PerformanceCounter("LogicalDisk", "% Free Space", "C:");
            return Math.Round(p.NextValue());
        }

        private static void GetAllCounters()
        {
            var har = new List<Hardware>();
            var categories = PerformanceCounterCategory.GetCategories();
            foreach (var cat in categories)
            {
                try
                {
                    var item = new Hardware { Name = cat.CategoryName, Data = new List<Tuple<string, string>>() };
                    var instances = cat.GetInstanceNames();
                    if (instances != null && instances.Length > 0)
                    {
                        foreach (var instance in instances)
                        {
                            if (cat.CategoryName == "Thread") continue;
                            foreach (var counter in cat.GetCounters(instance))
                            {
                                item.Data.Add(new Tuple<string, string>(counter.CounterName, instance));
                            }
                        }
                    }
                    else
                    {
                        foreach (var counter in cat.GetCounters())
                        {
                            item.Data.Add(new Tuple<string, string>(counter.CounterName, counter.CounterName));
                        }
                    }
                    har.Add(item);
                }
                catch (Exception e)
                {
                    var aa = 9;
                    // NO COUNTERS
                }
            }

            var a = 9;
        }

        private double GetPhysicalMemory()
        {
            var computerInfo = new Microsoft.VisualBasic.Devices.ComputerInfo();
            var b = computerInfo.AvailablePhysicalMemory;
            var a = computerInfo.TotalPhysicalMemory;

            var d = computerInfo.AvailableVirtualMemory;
            var dd = computerInfo.TotalVirtualMemory;

            ObjectQuery winQuery = new ObjectQuery("SELECT * FROM Win32_OperatingSystem");
            ManagementObjectSearcher searcher = new ManagementObjectSearcher(winQuery);

            double memory = 0;
            foreach (ManagementObject item in searcher.Get())
            {
                memory = double.Parse(item["TotalVirtualMemorySize"].ToString());
            }
            return memory;
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
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Management;
using Microsoft.VisualBasic.Devices;
using Newtonsoft.Json;

namespace ServerMonitor.Helpers
{
    public static class HardwareManager
    {
        private static PerformanceCounter CpuCounter { get; set; }
        private static readonly ComputerInfo ComputerInfo = new ComputerInfo();

        public static Hardware GetHardware()
        {
            var hardware = new Hardware
            {
                Name = ComputerName(),
                Data = new List<KeyValueData<double>>
                {
                    new KeyValueData<double> { Key = "CPU", Value = CpuUsage()},
                    new KeyValueData<double> { Key = "RAM", Value = MemoryUsage()},
                    new KeyValueData<double> { Key = "HDD", Value = DiskUsage()}
                }
            };
            return hardware;
        }

        private static double CpuUsage()
        {
            if (CpuCounter == null)
            {
                CpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");
            }
            return Math.Round(CpuCounter.NextValue());
        }

        private static double MemoryUsage()
        {
            var availableMemory = ComputerInfo.AvailablePhysicalMemory;
            var allMemory = ComputerInfo.TotalPhysicalMemory;
            var usedMemory = allMemory - availableMemory;
            var usage = usedMemory * 100 / allMemory;

            return Math.Round((double)usage);
        }

        private static double DiskUsage()
        {
            var p = new PerformanceCounter("LogicalDisk", "% Free Space", "C:");
            return Math.Round(p.NextValue());
        }

        private static string ComputerName()
        {
            ManagementClass mc = new ManagementClass("Win32_ComputerSystem");
            ManagementObjectCollection moc = mc.GetInstances();

            foreach (var item in moc)
            {
                return ((ManagementObject)item).Properties["DNSHostName"].Value.ToString();
            }

            return string.Empty;
        }

        [JsonObject(MemberSerialization.OptIn)]
        public class Hardware
        {
            [JsonProperty("key")]
            public string Name { get; set; }
            [JsonProperty("data")]
            public List<KeyValueData<double>> Data { get; set; }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using Microsoft.VisualBasic.Devices;
using ServerMonitor.Controllers;

namespace ServerMonitor.Helpers
{
    public class HardwareManager
    {
        private readonly ComputerInfo _computerInfo = new ComputerInfo();
        private static PerformanceCounter CpuCounter { get; set; }
        private static readonly ComputerInfo ComputerInfo = new ComputerInfo();
        private readonly DriveInfo _driveInfo = DriveInfo.GetDrives().First(x => x.Name == "C:\\");

        public Hardware GetHardware()
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
}
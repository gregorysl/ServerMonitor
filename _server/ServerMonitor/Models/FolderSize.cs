using System;

namespace ServerMonitor.Models
{
    public class FolderSize
    {
        public string Path { get; set; }
        public double Size { get; set; }
        public double TotalSize { get; set; }

        public double Usage
        {
            get
            {
                return Math.Round((Size / TotalSize) * 100, 2);
            }
        }
    }
}
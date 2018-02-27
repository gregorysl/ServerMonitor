using System;

namespace ServerMonitor.Models
{
    public class FolderSize
    {
        public string Path { get; set; }
        public double Size { get; set; }

        public double Usage
        {
            get
            {
                if (string.IsNullOrEmpty(Path) || Size == 0 ) return 0;
                var drive = System.IO.Path.GetPathRoot(Path);
                var driveInfo = new System.IO.DriveInfo(drive);
                return Math.Round((Size / driveInfo.TotalSize) * 100, 2);
            }
        }
    }
}
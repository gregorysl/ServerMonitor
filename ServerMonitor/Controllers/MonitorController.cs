using System;
using System.IO;
using System.Linq;
using System.Web.Http;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    public class MonitorController : BaseApi
    {
        [HttpGet]
        [Route("Monitor/GetDiskUsage")]
        public Response GetDiskUsage()
        {
            var response = new Response();
            try
            {
                var data = Settings.DirsToCheckSize
                    .Where(x => Path.GetPathRoot(x) != null)
                    .Select(x => new DirectoryInfo(x))
                    .Select(x => new FolderSize
                    {
                        Path = x.FullName,
                        Size = x.EnumerateFiles("*", SearchOption.AllDirectories).Sum(file => file.Length),
                        TotalSize = new DriveInfo(Path.GetPathRoot(x.FullName)).TotalSize
                    }
                    ).ToList();

                response.Data = data;
                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web.Http;
using Cassia;
using Microsoft.Web.Administration;
using ServerMonitor.Helpers;
using ServerMonitor.Models;
using ServerMonitor.Oracle;

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
                var foldersString = ConfigurationManager.AppSettings["PathsToCheckSize"];
                var data = foldersString.Split('|')
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

        protected static double CalculateFolderSize(string folder)
        {
            double folderSize = 0;
            try
            {
                if (!Directory.Exists(folder))
                    return folderSize;
                try
                {
                    folderSize = Directory.GetFiles(folder)
                                     .Where(File.Exists)
                                     .Select(x => new FileInfo(x))
                                     .Aggregate(folderSize, (current, finfo) => current + finfo.Length) +
                                 Directory.GetDirectories(folder).Sum(dir => CalculateFolderSize(dir));
                }
                catch (NotSupportedException e)
                {
                    Log.Error(e.Message);
                }
            }
            catch (UnauthorizedAccessException e)
            {
                Log.Error(e.Message);
            }

            return folderSize;
        }
    }
}


using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Management;
using System.Net;
using System.Net.Http;
using System.Web.Hosting;
using System.Web.Http;
using System.Xml.Linq;
using Cassia;
using Microsoft.Web.Administration;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    public class MonitorController : ApiController
    {
        private static string DB_PATH => HostingEnvironment.MapPath("~/App_Data/ServerMonitor.db");

        [HttpGet]
        public object Recycle(string Name)
        {
            try
            {
                var mgr = new ServerManager();
                var pool = mgr.ApplicationPools.FirstOrDefault(app => app.Name == Name);

                if (pool == null)
                {
                    return new { Message = "Application pool not found." };
                }

                pool.Recycle();

                return new { Message = "Application pool succesfully recycled." };
            }
            catch (Exception ex)
            {
                return new { ex.Message, Exception = ex.StackTrace };
            }

        }
        
        private static List<OracleInstanceDetails> GetAllOracleInstances()
        {
            var instanceManagerHost = ConfigurationManager.AppSettings["OracleInstanceApi"];
            if (string.IsNullOrEmpty(instanceManagerHost)) return null;
            if (!instanceManagerHost.EndsWith("/")) instanceManagerHost += "/";
            var url = instanceManagerHost + "OracleInstance";
            return ApiClient.Execute<List<OracleInstanceDetails>>(url, HttpMethod.Get);
        }

        public static void SetReserved(OracleInstanceReservationRequest request)
        {

            var instanceManagerHost = ConfigurationManager.AppSettings["OracleInstanceApi"];
            if (string.IsNullOrEmpty(instanceManagerHost)) return;

            if (!instanceManagerHost.EndsWith("/")) instanceManagerHost += "/";
            var url = instanceManagerHost + "OracleInstanceReservation";

            var content = ApiClient.GetHttpContent<OracleInstanceReservationRequest>(request);
            ApiClient.Execute(url, HttpMethod.Put, content);
        }
        

        [HttpGet]
        public object GetDiskUsage()
        {
            try
            {
                var foldersString = ConfigurationManager.AppSettings["PathsToCheckSize"];
                var paths = foldersString.Split('|');
                var sizes = new List<FolderSize>();

                foreach (var path in paths)
                {
                    sizes.Add(new FolderSize { Path = path, Size = CalculateFolderSize(path) });
                }

                return sizes;
            }
            catch (Exception ex)
            {
                return new { ex.Message, Exception = ex.StackTrace };
            }
        }

        protected static double CalculateFolderSize(string folder)
        {
            double folderSize = 0;
            try
            {
                //Checks if the path is valid or not
                if (!Directory.Exists(folder))
                    return folderSize;
                try
                {
                    foreach (string file in Directory.GetFiles(folder))
                    {
                        if (System.IO.File.Exists(file))
                        {
                            var finfo = new FileInfo(file);
                            folderSize += finfo.Length;
                        }
                    }

                    foreach (string dir in Directory.GetDirectories(folder))
                        folderSize += CalculateFolderSize(dir);
                }
                catch (NotSupportedException e)
                {

                }
            }
            catch (UnauthorizedAccessException e)
            {

            }
            return folderSize;
        }

        [HttpGet]
        public object GetOracleInstances()
        {
            try
            {
                var instances = GetAllOracleInstances();
                return instances;
            }
            catch (Exception ex)
            {
                return new { ex.Message, Exception = ex.StackTrace };
            }
        }

        [HttpPost]
        public object SetOracleInstanceReserved(int id, bool isReserved)
        {
            try
            {
                SetReserved(new OracleInstanceReservationRequest
                {
                    Id = id,
                    Reserve = isReserved
                });

                return new { Message = $"Succesfully {(!isReserved ? "" : "un")}reserved Oracle instance."};

            }
            catch (Exception ex)
            {
                return new { ex.Message, Exception = ex.StackTrace };
            }
        }

        [HttpGet]
        public object GetUserSesssions()
        {
            try
            {
                TerminalServicesManager manager = new TerminalServicesManager();
                using (ITerminalServer server = manager.GetLocalServer())
                {
                    server.Open();
                    var sessions = server.GetSessions()
                        .Where(s => !string.IsNullOrEmpty(s.UserName))
                        .Select(s => new
                        {
                            User = s.DomainName + @"\" + s.UserName,
                            LoginDate = s.LoginTime?.ToString("g"),
                            State = s.ConnectionState.ToString()
                        });
                    return sessions;

                }
            }
            catch (Exception ex)
            {
                return new { ex.Message, Exception = ex.StackTrace };
            }
        }
        
    }
}
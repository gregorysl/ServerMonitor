

using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Management;
using System.Net;
using System.Net.Http;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Xml.Linq;
using Cassia;
using LiteDB;
using Microsoft.Web.Administration;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    public class MonitorController : Controller
    {
        private static string DB_PATH => HostingEnvironment.MapPath("~/App_Data/ServerMonitor.db");

        [HttpGet]
        public ActionResult Recycle(string Name)
        {
            try
            {
                var mgr = new ServerManager();
                var pool = mgr.ApplicationPools.FirstOrDefault(app => app.Name == Name);

                if (pool == null)
                {
                    Response.StatusCode = 404;
                    return new { Message = "Application pool not found." }.ToJsonResult();
                }

                pool.Recycle();

                return new { Message = "Application pool succesfully recycled." }.ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }

        }


        [HttpPost]
        public ActionResult Stop(List<IISAppPool> appPools)
        {
            try
            {
                var poolsNames = appPools.Select(a => a.Name);
                var mgr = new ServerManager();
                var pools = mgr.ApplicationPools.Where(app => poolsNames.Contains(app.Name));

                foreach (var pool in pools)
                {
                    pool.Stop();
                }

                return new { Message = "Application pools stopped successfuly." }.ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }

        }

        [HttpPost]
        public ActionResult Start(List<IISAppPool> appPools)
        {
            try
            {
                var poolsNames = appPools.Select(a => a.Name);
                var mgr = new ServerManager();
                var pools = mgr.ApplicationPools.Where(app => poolsNames.Contains(app.Name));

                foreach (var pool in pools)
                {
                    pool.Start();
                }

                return new { Message = "Application pools started successfuly." }.ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
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
        public ActionResult GetDiskUsage()
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

                return sizes.ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
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
        public ActionResult GetOracleInstances()
        {
            try
            {
                var instances = GetAllOracleInstances();
                return instances.Select(i => new { i.Id, i.CurrentBuildName, CurrentBuildDate = i.CurrentBuildDate.ToString("g"), i.DisplayName, i.IsReserved, i.IsDeploying }).ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }
        }

        [HttpPost]
        public ActionResult SetOracleInstanceReserved(int id, bool isReserved)
        {
            try
            {
                SetReserved(new OracleInstanceReservationRequest
                {
                    Id = id,
                    Reserve = isReserved
                });

                return new { Message = $"Succesfully {(isReserved ? "" : "un")}reserved Oracle instance."}.ToJsonResult();

            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }
        }

        [HttpGet]
        public ActionResult GetUserSesssions()
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
                    return sessions.ToJsonResult();

                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }
        }
        
    }
}
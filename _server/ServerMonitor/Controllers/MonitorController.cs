

using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Cassia;
using log4net;
using Microsoft.Web.Administration;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    public class MonitorController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(MonitorController));

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
        
        private static Response GetAllOracleInstances()
        {
            var instanceManagerHost = ConfigurationManager.AppSettings["OracleInstanceApi"];
            if (string.IsNullOrEmpty(instanceManagerHost)) return null;
            var url = instanceManagerHost.EnsureSlash() + "OracleInstance";

            return ApiClient.Get<List<OracleInstanceDetails>>(url);
        }

        public static void SetReserved(OracleInstanceReservationRequest request)
        {

            var instanceManagerHost = ConfigurationManager.AppSettings["OracleInstanceApi"];
            if (string.IsNullOrEmpty(instanceManagerHost)) return;
            var url = instanceManagerHost.EnsureSlash() + "OracleInstanceReservation";

            var content = ApiClient.CreateHttpContent<OracleInstanceReservationRequest>(request);
            ApiClient.Put(url, content);
        }
        

        [HttpGet]
        [Route("Monitor/GetDiskUsage")]
        public object GetDiskUsage()
        {
            try
            {
                var foldersString = ConfigurationManager.AppSettings["PathsToCheckSize"];
                var data = foldersString.Split('|')
                    .Where(string.IsNullOrEmpty)
                    .Where(x => Path.GetPathRoot(x) != null)
                    .Select(path =>
                        new FolderSize
                        {
                            Path = path,
                            Size = CalculateFolderSize(path),
                            TotalSize = new DriveInfo(Path.GetPathRoot(path)).TotalSize
                        }).ToList();
                return data;
            }
            catch (Exception ex)
            {
                return new {ex.Message, Exception = ex.StackTrace};
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

                }
            }
            catch (UnauthorizedAccessException e)
            {

            }

            return folderSize;
        }

        [HttpGet]
        [Route("Monitor/GetOracleInstances")]
        public HttpResponseMessage GetOracleInstances()
        {
            try
            {
                var instances = GetAllOracleInstances();
                var responseCode = instances.Status == Status.Error ? HttpStatusCode.InternalServerError : HttpStatusCode.OK;
                var response = Request.CreateResponse(responseCode, instances);
                return response;
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new Response
                {
                    Notifications =
                    {
                        new Notification {Message = ex.Message, MessageDetails = ex.StackTrace, Status = Status.Error}
                    }
                });
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
        [Route("Monitor/GetUserSesssions")]
        public Response GetUserSesssions()
        {
            var response = new Response();
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
                    response.Data = sessions;
                    return response;
                }
            }
            catch (Exception ex)
            {
                response.Status = Status.Error;
                response.Notifications.Add(new Notification
                {
                    Message = ex.Message,
                    MessageDetails = ex.StackTrace,
                    Status = Status.Error
                });
                return response;

            }
        }
        
    }
}
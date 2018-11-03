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

namespace ServerMonitor.Controllers
{
    public class MonitorController : BaseApi
    {
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

        [HttpGet]
        [Route("Monitor/GetOracleInstances")]
        public Response GetOracleInstances()
        {
            var response = new Response();
            try
            {
                var instances = GetAllOracleInstances();
                response = instances;
                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }
        }

        [HttpPost]
        public Response SetOracleInstanceReserved(OracleInstanceReservationRequest request)
        {
            var response = new Response();
            try
            {
                SetReserved(request);
                response.AddSuccessNotification($"Succesfully {(request.Reserve ? "" : "un")}reserved Oracle instance.");
                return response;

            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }
        }

        [HttpGet]
        [Route("Monitor/GetUserSesssions")]
        public Response GetUserSesssions()
        {
            var response = new Response();
            try
            {
                var manager = new TerminalServicesManager();
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
                Log.Error(ex.Message);
                response.Status = Status.Error;
                response.Notifications.Add(new Notification
                {
                    Message = ex.Message,
                    MessageDetail = ex.StackTrace,
                    Status = Status.Error
                });
                return response;

            }
        }

        [HttpPost]
        [Route("Monitor/DropUserSession")]
        public Response DropUserSession([FromBody]string username)
        {
            var response = new Response();
            try
            {
                Log.Debug($"DropUserSession called for user {username}.");

                var manager = new TerminalServicesManager();
                using (ITerminalServer server = manager.GetLocalServer())
                {
                    server.Open();
                    var userSession = server.GetSessions()
                        .FirstOrDefault(s => string.Equals($@"{s.DomainName}\{s.UserName}", username, StringComparison.InvariantCultureIgnoreCase));

                    if (userSession == null)
                    {
                        response.Status = Status.Error;
                        response.AddErrorNotification($"User session for {username} not found.");
                        return response;
                    }

                    userSession.Logoff(true);
                }

                var message = $"Successfully closed session for user {username}.";
                Log.Debug(message);
                response.AddSuccessNotification(message);
                return response;

            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.Status = Status.Error;
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }
        }

    }
}
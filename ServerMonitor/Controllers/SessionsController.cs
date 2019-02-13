using System;
using System.Linq;
using System.Web.Http;
using Cassia;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("Sessions")]
    public class SessionsController : BaseApi
    {
        [Route]
        public Response Get()
        {
            var response = new Response();
            try
            {
                using (var server = new TerminalServicesManager().GetLocalServer())
                {
                    server.Open();
                    var sessions = server.GetSessions()
                        .Where(s => !string.IsNullOrEmpty(s.UserName))
                        .Select(s => new
                        {
                            Id = s.SessionId,
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
                response.AddErrorNotification(ex.Message,ex.StackTrace);
                return response;

            }
        }
        
        [Route("{id}")]
        public Response Delete(int id)
        {
            var response = new Response();
            try
            {
                Log.Debug($"DropUserSession called for session id {id}.");

                using (var server = new TerminalServicesManager().GetLocalServer())
                {
                    server.Open();
                    var userSession = server.GetSessions()
                        .FirstOrDefault(s => s.SessionId == id);

                    if (userSession == null)
                    {
                        response.AddErrorNotification($"User session {id} not found.");
                        return response;
                    }

                    userSession.Logoff(true);

                    var message = $"Session closed for user {userSession.UserName}.";
                    Log.Debug(message);
                    response.AddSuccessNotification(message);
                }

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
using System;
using System.Web.Http;
using ServerMonitor.Helpers;
using ServerMonitor.Models;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("BuildNote")]
    public class BuildNoteController : BaseApi
    {
        
        private NoteHelper Notes = new NoteHelper();
        [HttpGet]
        public Response GetBuildNotes(string name)
        {
            var response = new Response();
            try
            {
                var buildNote = Notes.Get(name);
                response.Data = buildNote;
                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }
        }

        [Route]
        public Response Post([FromBody] KeyValueData<string> data)
        {
            var response = new Response();
            try
            {
                Notes.Save(data.Key, data.Value);
                response.AddSuccessNotification("Application note saved succesfully.");
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
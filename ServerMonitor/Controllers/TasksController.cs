using Microsoft.Win32.TaskScheduler;
using System;
using System.Linq;
using System.Web.Http;
using ServerMonitor.Entities;

namespace ServerMonitor.Controllers
{
    [RoutePrefix("Tasks")]
    public class TasksController : BaseApi
    {
        [Route]
        public Response Get()
        {
            var response = new Response();
            try
            {
                Log.Debug("GetScheduledTasks called.");
                var details = GetScheduledTasks();
                Log.Debug("GetScheduledTasks call success.");
                response.Data = details;
                return response;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                response.ResponseStatus = Status.Error;
                response.AddErrorNotification(ex.Message, ex.StackTrace);
                return response;
            }
        }

        private object GetScheduledTasks()
        {
            var tasks = Settings.Data.ScheduledTasks;
            var taskDetails = TaskService.Instance.AllTasks.Where(t => tasks.Contains(t.Name));
            var details = taskDetails.Select(t => new
            {
                t.Name,
                State = t.State.ToString(),
                t.Path,
                LastRunTime = t.LastRunTime.ToString("g"),
                t.LastTaskResult
            });
            return details;
        }


        [Route("{name}")]
        public Response Post(string name)
        {
            var response = new Response();
            try
            {
                var task = TaskService.Instance.GetTask(name);
                if (task == null)
                {
                    response.AddErrorNotification("There is no task with given name");
                    return response;
                }

                string message;
                if (task.State == TaskState.Running)
                {
                    task.Stop();
                    message = "stopped";
                }
                else
                {
                    task.Run();
                    message = "started";
                }

                response.AddSuccessNotification($"Task {message} successful");
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
using Microsoft.Win32.TaskScheduler;
using System;
using System.Configuration;
using System.Linq;
using System.Web.Http;
using ServerMonitor.Helpers;

namespace ServerMonitor.Controllers
{
    public class TasksController : ApiController
    {

        [HttpGet]
        public object Get()
        {
            try
            {
                var tasks = ConfigurationManager.AppSettings["ScheduledTasksToView"];
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
            catch (Exception ex)
            {
                return new {ex.Message, Exception = ex.StackTrace};
            }
        }

        [HttpPost]
        public object Toggle(string name)
        {
            try
            {
                string message;
                var task = TaskService.Instance.GetTask(name);
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

                return new { Message = $"Task {message} successfuly."};
            }
            catch (Exception ex)
            {
                return new { ex.Message, Exception = ex.StackTrace };
            }
        }
    }
}
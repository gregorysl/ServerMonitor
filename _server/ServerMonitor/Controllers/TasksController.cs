using Microsoft.Win32.TaskScheduler;
using System;
using System.Configuration;
using System.Linq;
using System.Web.Mvc;
using ServerMonitor.Helpers;

namespace ServerMonitor.Controllers
{
    public class TasksController : Controller
    {

        [HttpGet]
        public ActionResult GetScheduledTasks()
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
                return details.ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new {ex.Message, Exception = ex.StackTrace}.ToJsonResult();
            }
        }

        [HttpPost]
        public ActionResult Toggle(string name)
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

                return new { Message = $"Task ${message} successfuly."}.ToJsonResult();
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return new { ex.Message, Exception = ex.StackTrace }.ToJsonResult();
            }
        }
    }
}
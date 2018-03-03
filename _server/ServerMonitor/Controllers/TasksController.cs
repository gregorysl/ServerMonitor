using Microsoft.Win32.TaskScheduler;
using System;
using System.Configuration;
using System.Linq;
using System.Web.Mvc;

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
                    Name = t.Name,
                    State = t.State.ToString(),
                    t.Path,
                    LastRunTime = t.LastRunTime.ToString("g"),
                    t.LastTaskResult
                });
                return Json(details, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult StartTask(string Path)
        {
            try
            {
                var task = TaskService.Instance.GetTask(Path);
                task.Run();
                return Json(new { Message = "Task started successfuly." });
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult StopTask(string Path)
        {
            try
            {
                var task = TaskService.Instance.GetTask(Path);
                task.Stop();
                return Json(new { Message = "Task stopped successfuly." });
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { ex.Message, Exception = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}
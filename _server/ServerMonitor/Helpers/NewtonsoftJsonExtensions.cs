using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ServerMonitor.Helpers
{
    public static class NewtonsoftJsonExtensions
    {
        public static ActionResult ToJsonResult(this object obj)
        {
            var content = new ContentResult
            {
                Content = JsonConvert.SerializeObject(obj,
                    new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore,
                        ContractResolver = new CamelCasePropertyNamesContractResolver()
                    }),
                ContentType = "application/json"
            };
            return content;
        }
    }
}
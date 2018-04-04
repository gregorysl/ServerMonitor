using System.Web.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ServerMonitor
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();
            config.Formatters.JsonFormatter.UseDataContractJsonSerializer = false;
            config.Formatters.Remove(GlobalConfiguration.Configuration.Formatters.XmlFormatter);
            config.Formatters.JsonFormatter.SerializerSettings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
            config.Routes.MapHttpRoute("DefaultApi", "{controller}/{action}");
            config.Routes.MapHttpRoute("Tasks", "{controller}/{action}/{name}", new {name = ""});
            config.Routes.MapHttpRoute("Api", "{controller}/");
        }
    }
}

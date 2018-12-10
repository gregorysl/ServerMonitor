using System.Web.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ServerMonitor.Helpers;

namespace ServerMonitor
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();
            config.MessageHandlers.Add(new ApiGatewayHandler());
            config.Formatters.JsonFormatter.UseDataContractJsonSerializer = false;
            config.Formatters.Remove(GlobalConfiguration.Configuration.Formatters.XmlFormatter);
            config.Formatters.JsonFormatter.SerializerSettings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
          
            config.Routes.MapHttpRoute(
                name: "API Default",
                routeTemplate: "{controller}/{name}",
                defaults: new { name = RouteParameter.Optional }
            );
        }
    }
}

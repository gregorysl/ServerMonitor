using System.Net;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ServerMonitor.Helpers;

namespace ServerMonitor
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(config =>
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

                ServicePointManager.ServerCertificateValidationCallback +=
                    (sender, cert, chain, sslPolicyErrors) => true;
            });
        }
    }
}

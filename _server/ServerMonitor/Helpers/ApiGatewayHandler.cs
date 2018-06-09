using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using ServerMonitor.Models;

namespace ServerMonitor.Helpers
{
    public class ApiGatewayHandler : DelegatingHandler
    {
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            var response = await base.SendAsync(request, cancellationToken);

            if (response != null && response.StatusCode == HttpStatusCode.NotFound)
            {
                var msg = await response.Content.ReadAsStringAsync();

                //you can change the response here
                if (msg != null && msg.Contains("No HTTP resource was found"))
                {
                    var a = new JavaScriptSerializer().Deserialize<Notification>(msg);
                    return new HttpResponseMessage
                    {
                        StatusCode = HttpStatusCode.NotFound,
                        Content = new ObjectContent(typeof(Response),
                            new Response()
                            {
                                Status = Status.Error,
                                Notifications =
                                    new List<Notification> { new Notification { Status = Status.Error, Message = "asdasd" } }
                            },
                            new JsonMediaTypeFormatter())
                    };
                }
            }

            return response;
        }
    }
}
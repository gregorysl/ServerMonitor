﻿using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ServerMonitor.Entities;

namespace ServerMonitor.Helpers
{
    public class ApiGatewayHandler : DelegatingHandler
    {
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            var response = await base.SendAsync(request, cancellationToken);
            
            if (response != null && !response.IsSuccessStatusCode)
            {
                var msg = await response.Content.ReadAsStringAsync();

                var notification = JsonConvert.DeserializeObject<Notification>(msg);
                notification.Status = Status.Error;
                return new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Content = new ObjectContent(typeof(Response),
                        new Response
                        {
                            ResponseStatus = Status.Error,
                            Notifications =
                                new List<Notification> {notification}
                        },
                        new JsonMediaTypeFormatter
                        {
                            SerializerSettings = new JsonSerializerSettings
                            {
                                NullValueHandling = NullValueHandling.Ignore,
                                ContractResolver = new CamelCasePropertyNamesContractResolver()
                            }
                        })
                };

            }

            return response;
        }
    }
}
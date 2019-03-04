using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using ServerMonitor.Models;

namespace ServerMonitor.Helpers
{
    public static class LinksHelper
    {
        public static Link GetLinkStatus(UncheckedLink item)
        {
            var credentials = !string.IsNullOrWhiteSpace(item.Username) && !string.IsNullOrWhiteSpace(item.Password)
                ? new NetworkCredential(item.Username, item.Password)
                : null;
            var link = new Link(item);

            try
            {
                using (var handler = new HttpClientHandler { Credentials = credentials })
                {
                    using (var client = new HttpClient(handler)
                    {
                        BaseAddress = new Uri(item.Url, UriKind.Absolute),
                        Timeout = TimeSpan.FromSeconds(30)
                    })
                    {
                        using (client)
                        {
                            ServicePointManager.ServerCertificateValidationCallback +=
                                (sender, cert, chain, sslPolicyErrors) => true;
                            client.DefaultRequestHeaders.Accept.Clear();
                            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                            var linkResponse = client.GetAsync(client.BaseAddress).Result;
                            link.Message = linkResponse.StatusCode.ToString();
                            link.Working = linkResponse.IsSuccessStatusCode;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                link.Working = false;
                link.Message = GatherExceptions(ex);
            }

            return link;
        }

        private static string GatherExceptions(Exception e)
        {
            var exception = $"{e.Message}\\r\\n";
            return e.InnerException != null ? exception + GatherExceptions(e.InnerException) : exception;
        }
    }
}

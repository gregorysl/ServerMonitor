using BuildInspect.Data.Entities;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace BuildInspect.Data.Helpers
{
    public static class OutputHelpers
    {
        public static string GetJsonBuildsData(this IEnumerable<BuildEntity> builds)
        {
            return JsonConvert.SerializeObject(builds, Formatting.Indented);
        }
    }
}

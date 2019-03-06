using Newtonsoft.Json;
using System.IO;
using System.Web.Hosting;

namespace ServerMonitor.Helpers
{
    public class SettingsHelper
    {
        private string _path = HostingEnvironment.MapPath("~/settings.json");
        public JsonSettings Get()
        {
            var json = File.ReadAllText(_path);
            var sett = JsonConvert.DeserializeObject<JsonSettings>(json);
            return sett;
        }

        public void Save(JsonSettings settings)
        {
            var json = JsonConvert.SerializeObject(settings, Formatting.Indented);
            File.WriteAllText(_path, json);
        }
    }
}
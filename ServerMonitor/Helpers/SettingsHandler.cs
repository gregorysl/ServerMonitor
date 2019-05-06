using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.IO;
using System.Web.Hosting;

namespace ServerMonitor.Helpers
{
    public class SettingsHandler
    {
        private static SettingsHandler _instance;
        public JsonSettings Data { get; set; }

        public SettingsHandler()
        {
            Get();
        }

        public static SettingsHandler Instance => _instance ?? (_instance = new SettingsHandler());

        private static readonly string _path = HostingEnvironment.MapPath("~/settings.json");

        public void Get()
        {
            EnsureFileExist(_path);
            var json = File.ReadAllText(_path);
            var sett = JsonConvert.DeserializeObject<JsonSettings>(json);
            Data = sett;
        }

        public void Save(JsonSettings settings)
        {
            var json = JsonConvert.SerializeObject(settings, new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                },
                Formatting = Formatting.Indented
            });
            File.WriteAllText(_path, json);
            Get();
        }

        private void EnsureFileExist(string path)
        {
            var fileInfo = new FileInfo(path);
            if (fileInfo.Exists) return;
            Directory.CreateDirectory(fileInfo.Directory.FullName);
            File.Create(path).Close();
            Save(new JsonSettings());
        }
    }
}
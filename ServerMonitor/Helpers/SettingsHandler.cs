using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.IO;
using System.Web.Hosting;
using ServerMonitor.Entities;

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
        
        private static readonly string Path = HostingEnvironment.MapPath("~/settings.json");

        public void Get()
        {
            EnsureFileExist(Path);
            var json = File.ReadAllText(Path);
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
            File.WriteAllText(Path, json);
            Get();
        }

        private void EnsureFileExist(string path)
        {
            var fileInfo = new FileInfo(path);
            if (fileInfo.Exists) return;
            if (fileInfo.Directory != null) Directory.CreateDirectory(fileInfo.Directory.FullName);
            File.Create(path).Close();
            var defaultWhitelistType = WhitelistType.Xml;
            var defaultSettings = new JsonSettings
            {
                Cleaner = new FilterInput
                {
                    WhitelistType = defaultWhitelistType,
                    JsonWhitelistPath = HostingEnvironment.MapPath($"~/whitelist.{defaultWhitelistType}")
                }
            };
            Save(defaultSettings);
        }
    }
}
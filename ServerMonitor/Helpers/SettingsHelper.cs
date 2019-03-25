﻿using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.IO;
using System.Web.Hosting;

namespace ServerMonitor.Helpers
{
    public class SettingsHelper
    {
        readonly JsonSerializerSettings serializerSettings = new JsonSerializerSettings
        {
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            },
            Formatting = Formatting.Indented
        };
        private string _path = HostingEnvironment.MapPath("~/settings.json");
        public JsonSettings Get()
        {
            EnsureFileExist(_path);
              var json = File.ReadAllText(_path);
            var sett = JsonConvert.DeserializeObject<JsonSettings>(json);
            return sett;
        }

        public void Save(JsonSettings settings)
        {
            var json = JsonConvert.SerializeObject(settings, serializerSettings);
            File.WriteAllText(_path, json);
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
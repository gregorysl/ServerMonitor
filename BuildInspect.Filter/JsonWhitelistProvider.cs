using BuildInspect.Data.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace BuildInspect.Filter
{
    public class JsonWhitelistProvider : IWhitelistProvider
    {
        private readonly string _path;
        private static ILogManager LogManager => new NLogManger();

        public JsonWhitelistProvider(string path)
        {
            _path = path;
        }

        public List<string> GetWhitelist()
        {
            try
            {
                var whitelist = new List<string>();
                var file = new FileInfo(_path);
                if (!file.Exists)
                {
                    Directory.CreateDirectory(file.Directory.FullName);
                    File.Create(_path).Close();
                    return whitelist;
                }
                var whitelistJson = File.ReadAllText(_path);
                whitelist = JsonConvert.DeserializeObject<List<string>>(whitelistJson) ?? new List<string>();
                return whitelist;
            }
            catch (Exception e)
            {
                LogManager.Critical(e.Message);
                throw;
            }
        }
    }
}

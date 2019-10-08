using BuildInspect.Data.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace BuildInspect.Filter
{
    public class JsonWhitelistProvider : IWhitelistProvider
    {
        private readonly string _path;
        private List<string> _whitelist;
        private static ILogManager LogManager => new NLogManger();

        public JsonWhitelistProvider(string path)
        {
            _path = path;
            _whitelist = new List<string>();
        }
        public void Load()
        {
            var file = new FileInfo(_path);
            if (!file.Exists)
            {
                Directory.CreateDirectory(file.Directory.FullName);
                File.Create(_path).Close();
            }
            var whitelistJson = File.ReadAllText(_path);
            _whitelist = JsonConvert.DeserializeObject<List<string>>(whitelistJson) ?? new List<string>();
        }

        public List<string> Get()
        {
            try
            {
                Load();
                return _whitelist;
            }
            catch (Exception e)
            {
                LogManager.Critical(e.Message);
                throw;
            }
        }

        public void Save()
        {
            var json = JsonConvert.SerializeObject(_whitelist);
            File.WriteAllText(_path, json);
        }

        public bool Toggle(string name)
        {
            Load();
            var isWhitelisted = _whitelist.Any(x => x == name);
            if (isWhitelisted)
            {
                _whitelist.Remove(name);
            }
            else
            {
                _whitelist.Add(name);
            }
            Save();
            return !isWhitelisted;
        }
    }
}

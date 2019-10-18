using System;
using System.IO;
using Newtonsoft.Json;

namespace ServerMonitor.Entities
{
    public class ApplicationEntity
    {
        public ApplicationEntity(string name, string applicationPoolName, string dir)
        {
            Name = name.TrimStart('/');
            Pool = applicationPoolName;
            DirectoryInfo appDir = GetAppDirectory(dir);
            if (appDir == null)
            {
                PathExists = false;
            }
            else
            {
                CreatedDateTime = appDir.CreationTime;
            }
        }
        [JsonConstructor]
        public ApplicationEntity(string name, string pool, bool running)
        {
            Name = name;
            Pool = pool;
            Running = running;
        }
        public ApplicationEntity(string name, DateTime created)
        {
            Name = name.TrimStart('/');
            Pool = name.TrimStart('/');
            CreatedDateTime = created;
        }

        public string Name { get; }
        public string Pool { get; }

        [JsonIgnore]
        public DateTime CreatedDateTime { get; } = DateTime.MinValue;

        public bool Running { get; set; } = true;
        public bool PathExists { get; set; }


        private DirectoryInfo GetAppDirectory(string physicalPath)
        {
            physicalPath = Environment.ExpandEnvironmentVariables(physicalPath);
            var dir = new DirectoryInfo(physicalPath);
            return dir.Exists ? dir : null;
        }
        public override string ToString()
        {
            return Name;
        }
    }
}

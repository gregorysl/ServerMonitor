using System;
using System.IO;
using Newtonsoft.Json;

namespace BuildInspect.Data.Entities
{
    public class ApplicationEntity
    {
        public ApplicationEntity(string name, string applicationPoolName, string dir)
        {
            Name = name.TrimStart('/');
            Pool = applicationPoolName;
            DirectoryInfo appDir = GetAppDirectory(dir);
            CreatedDateTime = appDir?.CreationTime;
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
        public DateTime? CreatedDateTime { get; }
        public bool Running { get; set; }

        private DirectoryInfo GetAppDirectory(string physicalPath)
        {
            physicalPath = Environment.ExpandEnvironmentVariables(physicalPath);
            var dir = new DirectoryInfo(physicalPath);
            return !dir.Exists ? null : dir;
        }
        public override string ToString()
        {
            return Name;
        }
    }
}

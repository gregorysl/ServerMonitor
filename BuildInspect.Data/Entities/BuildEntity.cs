using System;
using System.Collections.Generic;
using System.Linq;

namespace BuildInspect.Data.Entities
{
    public class BuildEntity
    {
        private int CurrentlyRunning => Apps.Count(a => a.Running);

        public BuildEntity(string name, List<ApplicationEntity> apps)
        {
            Name = name;
            Apps = apps ?? new List<ApplicationEntity>();
        }

        public string Name { get; }
        public string Note { get; set; }
        public List<ApplicationEntity> Apps { get; set; }
        public bool Whitelisted { get; set; }
        public bool CleanerMark { get; set; }
        public DateTime CreatedDateTime => Apps.Max(a => a.CreatedDateTime);
        public string State =>
                       Apps.All(a => a.Running) ? "Running"
                     : Apps.Any(a => a.Running) ? $"{CurrentlyRunning}/{Apps.Count} running"
                     : "Stopped";
        public bool Running => CurrentlyRunning > Apps.Count / 2;
        public int DaysOld => (DateTime.Now - CreatedDateTime).Days;
    }
}

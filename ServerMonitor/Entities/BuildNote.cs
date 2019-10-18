using System;
using LiteDB;

namespace ServerMonitor.Entities
{
    public class BuildNote
    {
        [BsonId]
        public Guid Id { get; set; }
        public string BuildName { get; set; }
        public string Note { get; set; }
    }
}
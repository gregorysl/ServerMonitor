using System;
using LiteDB;

namespace ServerMonitor.Models
{
    public class BuildNote
    {
        [BsonId]
        public Guid Id { get; set; }
        public string BuildName { get; set; }
        public string Note { get; set; }
    }
}
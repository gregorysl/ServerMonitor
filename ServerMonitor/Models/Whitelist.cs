using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ServerMonitor.Models
{
    public class Whitelist
    {
        public List<string> Builds { get; set; } = new List<string>();
        public List<string> Services { get; set; } = new List<string>();
    }
}
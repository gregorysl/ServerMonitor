using System.Collections.Generic;

namespace ServerMonitor.Models
{
    public class IssToggleConfig
    {
        public IssToggleConfig(List<string> appPools, bool condition)
        {
            AppPools = appPools;
            Condition = condition;
        }

        public List<string> AppPools { get; }
        public bool Condition { get; }
    }
}
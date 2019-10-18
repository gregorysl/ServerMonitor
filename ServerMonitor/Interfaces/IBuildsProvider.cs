using System.Collections.Generic;
using ServerMonitor.Entities;

namespace ServerMonitor.Interfaces
{
    public interface IBuildsProvider
    {
        IEnumerable<BuildEntity> GetBuilds();
    }
}

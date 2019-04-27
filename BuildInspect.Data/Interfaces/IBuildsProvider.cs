using System.Collections.Generic;
using BuildInspect.Data.Entities;

namespace BuildInspect.Data.Interfaces
{
    public interface IBuildsProvider
    {
        IEnumerable<BuildEntity> GetBuilds();
    }
}

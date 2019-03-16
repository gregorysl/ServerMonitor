using BuildInspect.Data.Entities;
using System.Collections.Generic;


namespace BuildInspect.Data.Helpers
{
    public class BuildEntityComparer : IEqualityComparer<BuildEntity>
    {
        private static BuildEntityComparer _instance;
        public static BuildEntityComparer Instance => _instance ?? (_instance = new BuildEntityComparer());

        private BuildEntityComparer()
        {
        }

        public bool Equals(BuildEntity x, BuildEntity y)
        {
            return x.Name == y.Name;
        }

        public int GetHashCode(BuildEntity obj)
        {
            return obj.Name.GetHashCode();
        }
    }
}

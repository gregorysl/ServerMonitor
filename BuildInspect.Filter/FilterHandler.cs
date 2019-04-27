using BuildInspect.Data;
using BuildInspect.Data.Entities;
using BuildInspect.Data.Helpers;
using BuildInspect.Data.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace BuildInspect.Filter
{
    public class FilterHandler
    {
        private readonly IWhitelistProvider _whitelistProvider;
        private readonly IBuildsProvider _buildsProvider;
        public FilterHandler(IWhitelistProvider whitelistProvider, IBuildsProvider buildsProvider)
        {
            _whitelistProvider = whitelistProvider;
            _buildsProvider = buildsProvider;
        }
        public List<BuildEntity> Execute(FilterInput input)
        {
            var all = _buildsProvider.GetBuilds();
            var toRemoveBuilds = _buildsProvider.GetBuilds();
            var whitelisted = _whitelistProvider.GetWhitelist();

            bool daysSelected = input.BeforeDays != null;
            bool countSelected = input.ExcludeNLast != null;

            if (input.UseWhiteList)
            {
                var whitelistBuilds = FilterBy.GetBuildsToRemoveByWhiteList(toRemoveBuilds, whitelisted);
                toRemoveBuilds = toRemoveBuilds.Intersect(whitelistBuilds, BuildEntityComparer.Instance);
            }

            if (daysSelected)
            {
                var daysBuilds = FilterBy.GetBuildsToRemoveOlderThan(all, input.BeforeDays.GetValueOrDefault());
                toRemoveBuilds = toRemoveBuilds.Intersect(daysBuilds, BuildEntityComparer.Instance);
            }

            if (countSelected)
            {
                var numberBuilds = FilterBy.GetBuildsToRemoveExceptNLast(all, input.ExcludeNLast.GetValueOrDefault());
                toRemoveBuilds = toRemoveBuilds.Intersect(numberBuilds, BuildEntityComparer.Instance);
            }

            return toRemoveBuilds.ToList();
        }
    }

}

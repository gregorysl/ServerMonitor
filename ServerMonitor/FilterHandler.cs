using System.Collections.Generic;
using System.Linq;
using ServerMonitor.Entities;
using ServerMonitor.Helpers;
using ServerMonitor.Interfaces;

namespace ServerMonitor
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
            var whitelisted = _whitelistProvider.Get();

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

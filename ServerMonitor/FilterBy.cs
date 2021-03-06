﻿using System;
using System.Collections.Generic;
using System.Linq;
using ServerMonitor.Entities;

namespace ServerMonitor
{
    public static class FilterBy
    {
        public static IEnumerable<BuildEntity> GetBuildsToRemoveByWhiteList(IEnumerable<BuildEntity> builds, IEnumerable<string> whiteBuilds)
        {
            return builds.Where(b => whiteBuilds.All(w => w != b.Name));
        }

        public static IEnumerable<BuildEntity> GetBuildsToRemoveBeforeCreatedDateTime(IEnumerable<BuildEntity> builds, DateTime createdDateTime)
        {
            return builds.Where(b => b.CreatedDateTime <= createdDateTime);
        }

        public static IEnumerable<BuildEntity> GetBuildsToRemoveAfterCreatedDateTime(IEnumerable<BuildEntity> builds, DateTime createdDateTime)
        {
            return builds.Where(b => b.CreatedDateTime >= createdDateTime);
        }
        public static IEnumerable<BuildEntity> GetBuildsToRemoveOlderThan(IEnumerable<BuildEntity> builds, int days)
        {
            return builds.Where(b => b.CreatedDateTime <= DateTime.Now.AddDays(-days));
        }

        public static IEnumerable<BuildEntity> GetBuildsToRemoveExceptNLast(IEnumerable<BuildEntity> builds, int n)
        {
            var orderedBuilds = builds.OrderByDescending(b => b.CreatedDateTime);
            return orderedBuilds.Skip(n);
        }
    }
}

using System.Collections.Generic;
using System.Linq;
using Microsoft.Web.Administration;
using ServerMonitor.Entities;

namespace ServerMonitor.Helpers
{
    public class IisHandler
    {
        private readonly SettingsHandler _settings = SettingsHandler.Instance;
        private readonly CommonNameBuildsProvider _commonNameBuildsProvider;
        private readonly WhitelistHandler _whitelistHandler;

        public IisHandler()
        {
            _commonNameBuildsProvider = new CommonNameBuildsProvider(_settings.Data.CommonAppName);
            _whitelistHandler = new WhitelistHandler();
        }

        public List<BuildEntity> GetBuildsToClean()
        {
            var filterHandler = new FilterHandler(_whitelistHandler.Provider, _commonNameBuildsProvider);
            var buildsToRemove = filterHandler.Execute(_settings.Data.Cleaner);

            return buildsToRemove;
        }

        public bool ToggleWhitelistForBuild(string name)
        {
            var builds = _commonNameBuildsProvider.GetBuilds().FirstOrDefault(x=>x.Name == name)?.Apps.Select(x=>x.Name).ToList(); 
            return _whitelistHandler.Provider.Toggle(builds);
        }

        public IList<BuildEntity> GetFilteredApps()
        {
            var builds = _commonNameBuildsProvider.GetBuilds().OrderBy(x => x.Name).ToList();

            var whitelist = _whitelistHandler.Provider.Get();
            FillAdditionalData(builds, whitelist);

            var cleanList = GetBuildsToClean();
            builds.ForEach(x => x.CleanerMark = cleanList.FirstOrDefault(c => c.Name == x.Name) != null);

            var notes = new NoteHelper().GetAll();
            builds.ForEach(x => x.Note = notes.FirstOrDefault(n => n.BuildName == x.Name)?.Note);

            return builds;
        }

        public bool RecycleAppPool(string name)
        {
            ApplicationPool pool;
            using (var mgr = new ServerManager())
            {
                pool = mgr.ApplicationPools.FirstOrDefault(app => app.Name == name);
            }
            
            if (pool == null || pool.State == ObjectState.Stopped)
            {
                return false;
            }
            pool.Recycle();
            return true;
        }

        public void Toggle(List<string> list)
        {
            using (var mgr = new ServerManager())
            {
                var pools = mgr.ApplicationPools.Where(app => list.Contains(app.Name));

                foreach (var pool in pools)
                {
                    var newState = pool.State == ObjectState.Started ? pool.Stop() : pool.Start();
                }
            }
        }
        public void FillAdditionalData(IEnumerable<BuildEntity> builds,
            List<string> whitelist)
        {
            List<ApplicationPool> appPools;
            using (var serverManager = new ServerManager())
            {
                appPools = serverManager.ApplicationPools.ToList();
            }

            foreach (var build in builds)
            {
                build.Whitelisted = whitelist.Any(x => x == build.Name);
                var apNames = build.Apps.Select(a => a.Pool);
                foreach (var app in build.Apps)
                {
                    var pool = appPools.FirstOrDefault(x => x.Name == app.Pool);
                    app.Running = pool?.State == ObjectState.Started;
                }
            }
        }
    }
}
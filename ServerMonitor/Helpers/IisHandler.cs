using System.Collections.Generic;
using System.Linq;
using System.Web.Hosting;
using BuildInspect.Data.Entities;
using BuildInspect.Filter;

namespace ServerMonitor.Helpers
{
    public class IisHandler
    {
        private readonly SettingsHandler _settings = SettingsHandler.Instance;
        private readonly string _whitelistPath = HostingEnvironment.MapPath("~/whitelist.json");
        private readonly CommonNameBuildsProvider _commonNameBuildsProvider;
        private readonly JsonWhitelistProvider _jsonWhitelistProvider;

        public IisHandler()
        {
            _commonNameBuildsProvider = new CommonNameBuildsProvider(_settings.Data.CommonAppName);
            _jsonWhitelistProvider = new JsonWhitelistProvider(_whitelistPath);
        }

        public List<BuildEntity> GetBuildsToClean()
        {
            var filterHandler = new FilterHandler(_jsonWhitelistProvider, _commonNameBuildsProvider);
            var buildsToRemove = filterHandler.Execute(_settings.Data.Cleaner);

            return buildsToRemove;
        }


        public IList<BuildEntity> GetFilteredApps()
        {
            var builds = _commonNameBuildsProvider.GetBuilds().OrderBy(x => x.Name).ToList();

            var whitelist = _jsonWhitelistProvider.GetWhitelist();
            builds.FillAdditionalData(whitelist);

            var cleanList = GetBuildsToClean();
            builds.ForEach(x => x.CleanerMark = cleanList.FirstOrDefault(c => c.Name == x.Name) != null);

            var notes = new NoteHelper().GetAll();
            builds.ForEach(x => x.Note = notes.FirstOrDefault(n => n.BuildName == x.Name)?.Note);

            return builds;
        }
    }
}
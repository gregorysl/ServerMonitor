using System.Collections.Generic;

namespace ServerMonitor.Interfaces
{
    public interface IWhitelistProvider
    {
        void Load();
        void Save();
        List<string> Get();
        bool Toggle(string name);

    }
}

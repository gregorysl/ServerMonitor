using System.Collections.Generic;

namespace ServerMonitor.Interfaces
{
    public interface IWhitelistProvider
    {
        List<string> Get();
        bool Toggle(string name);

    }
}

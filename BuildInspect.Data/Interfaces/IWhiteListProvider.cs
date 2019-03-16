using System.Collections.Generic;

namespace BuildInspect.Data.Interfaces
{
    public interface IWhitelistProvider
    {
        List<string> GetWhitelist();
    }
}


using BuildInspect.Data.Interfaces;
using NLog;

namespace BuildInspect.Filter
{
    public class NLogManger : ILogManager
    {
        private Logger _nLog;

        public Logger Logger => _nLog ?? (_nLog = LogManager.GetCurrentClassLogger());

        public void Trace(string msg, params object[] args)
        {
            Logger.Trace(msg, args);
        }

        public void Debug(string msg, params object[] args)
        {
            Logger.Debug(msg, args);
        }

        public void Info(string msg, params object[] args)
        {
            Logger.Info(msg, args);
        }

        public void Warning(string msg, params object[] args)
        {
            Logger.Warn(msg, args);
        }

        public void Error(string msg, params object[] args)
        {
            Logger.Error(msg, args);
        }

        public void Critical(string msg, params object[] args)
        {
            Logger.Fatal(msg, args);
        }
    }
}

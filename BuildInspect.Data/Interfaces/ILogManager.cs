namespace BuildInspect.Data.Interfaces
{
    public interface ILogManager
    {
        void Trace(string msg, params object[] args);
        void Debug(string msg, params object[] args);
        void Info(string msg, params object[] args);
        void Warning(string msg, params object[] args);
        void Error(string msg, params object[] args);
        void Critical(string msg, params object[] args);
    }
}

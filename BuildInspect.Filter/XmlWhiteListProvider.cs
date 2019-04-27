using System;
using System.IO;
using System.Linq;
using System.Xml.Linq;
using BuildInspect.Data.Interfaces;
using System.Collections.Generic;

namespace BuildInspect.Filter
{
    public class XmlWhitelistProvider : IWhitelistProvider
    {
        private readonly string _path;
        private static ILogManager LogManager => new NLogManger();

        public XmlWhitelistProvider(string path)
        {
            _path = path;
        }

        public List<string> GetWhitelist()
        {
            try
            {
                var whiteListDoc = XDocument.Load(_path);
                return whiteListDoc.Descendants("builds").First().Descendants("app")
                        .Select(x => x.Attribute("value")?.Value).ToList();
            }
            catch (NullReferenceException e)
            {
                LogManager.Critical(e.Message);
                throw;
            }
            catch (FileNotFoundException e)
            {
                LogManager.Critical(e.Message);
                throw;
            }
            catch (ArgumentNullException e)
            {
                LogManager.Critical(e.Message);
                throw;
            }
        }
    }
}

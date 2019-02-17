using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

namespace ServerMonitor.Helpers
{
    public static class XmlHelper
    {
        public static List<string> GetAllValuesByNode(this XDocument document, string node)
        {
            return document.Descendants(node).First().Descendants("app").Select(x => x.Attribute("value")?.Value).ToList();
        }
    }
}
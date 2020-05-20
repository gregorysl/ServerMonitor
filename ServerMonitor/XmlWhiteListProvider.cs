using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;
using log4net;
using ServerMonitor.Interfaces;

namespace ServerMonitor
{
    public class XmlWhitelistProvider : IWhitelistProvider
    {
        protected static readonly ILog Log = LogManager.GetLogger(typeof(XmlWhitelistProvider));
        private readonly string _path;
        private Whitelist _whitelist;

        public XmlWhitelistProvider(string path)
        {
            _path = path;
        }

        public void Load()
        {
            var file = new FileInfo(_path);
            if (file.Directory != null && !file.Exists)
            {
                Directory.CreateDirectory(file.Directory.FullName);
                var xml = new XDocument(new XElement("whiteList", new XElement("builds")));
                xml.Save(_path);
            }

            var whitelistFile = XElement.Load(_path);
            var whitelist = new Whitelist();
            ParseToList(whitelistFile, whitelist);

            _whitelist = whitelist;
        }

        public List<string> Get()
        {
            try
            {
                Load();
                return _whitelist.Builds.Select(x => x.Value).ToList();
            }
            catch (Exception e)
            {
                Log.Fatal(e.Message);
                throw;
            }
        }

        public void Save()
        {
            var serializer = new XmlSerializer(_whitelist.GetType());
            using (var stream = new MemoryStream())
            {
                serializer.Serialize(stream, _whitelist);
                stream.Position = 0;
                var xmlDocument = new XmlDocument();
                xmlDocument.Load(stream);
                xmlDocument.Save(_path);
            }
        }

        public bool Toggle(string name)
        {
            Load();
            var searchedItem = _whitelist.Builds.FirstOrDefault(x => x.Value == name);
            var isWhitelisted = searchedItem != null;
            if (isWhitelisted)
            {
                _whitelist.Builds.Remove(searchedItem);
            }
            else
            {
                _whitelist.Builds.Add(new WhiteListApp { Value = name });
            }
            Save();
            return !isWhitelisted;
        }

        public bool Toggle(List<string> list)
        {
            Load();
            var searchedItem = _whitelist.Builds.Where(x => list.Contains(x.Value)).ToList();
            var isWhitelisted = searchedItem.Any();
            if (isWhitelisted)
            {
                foreach (var whiteListApp in searchedItem)
                {
                    _whitelist.Builds.Remove(whiteListApp);
                }
            }
            else
            {
                var toAdd = list.Select(x => new WhiteListApp {Value = x});
                _whitelist.Builds.AddRange(toAdd);
            }
            Save();
            return !isWhitelisted;
        }

        public void ParseToList(XElement el, Whitelist whitelist)
        {
            foreach (var node in el.Elements())
            {
                if (node.Elements().Any())
                {
                    ParseToList(node, whitelist);
                }
                else
                {
                    var value = node.Attributes().FirstOrDefault(x => x.Name == "value")?.Value;
                    whitelist.Builds.Add(new WhiteListApp { Value = value });
                }
            }
        }
    }


    [Serializable, XmlRoot("whiteList")]
    public class Whitelist
    {
        [XmlArray("builds")]
        [XmlArrayItem("app")]
        public List<WhiteListApp> Builds { get; set; } = new List<WhiteListApp>();
    }

    public class WhiteListApp
    {
        [XmlAttribute("value")]
        public string Value { get; set; }
        public override string ToString()
        {
            return Value;
        }
    }




}

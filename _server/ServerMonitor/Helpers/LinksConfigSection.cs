using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using ServerMonitor.Models;

namespace ServerMonitor.Helpers
{
    public static class LinksHelper
    {
        public static IEnumerable<LinkItem> GetLinks(string name)
        {
            var config = ConfigurationManager.GetSection(name) as LinksConfigSection;
            return config?.Instances.Cast<LinkItem>();
        }

        public static Link FromConfig(this LinkItem link)
        {
            return new Link
            {
                Name = link.Name,
                Url = link.Url, 
                Type = link.Type
            };
        }
    }
    public class LinksConfigSection : ConfigurationSection
    {
        [ConfigurationProperty("", IsRequired = true, IsDefaultCollection = true)]
        public LinkCollection Instances
        {
            get => (LinkCollection) this[""];
            set => this[""] = value;
        }
    }
    public class LinkCollection : ConfigurationElementCollection
    {
        protected override ConfigurationElement CreateNewElement()
        {
            return new LinkItem();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((LinkItem)element).Name;
        }
    }

    public class LinkItem : ConfigurationElement
    {
        [ConfigurationProperty("name", IsKey = true, IsRequired = true)]
        public string Name
        {
            get => (string) base["name"];
            set => base["name"] = value;
        }

        [ConfigurationProperty("url", IsRequired = true)]
        public string Url
        {
            get => (string) base["url"];
            set => base["url"] = value;
        }

        [ConfigurationProperty("username", IsRequired = false)]
        public string Username
        {
            get => (string) base["username"];
            set => base["username"] = value;
        }

        [ConfigurationProperty("password", IsRequired = false)]
        public string Password
        {
            get => (string)base["password"];
            set => base["password"] = value;
        }

        [ConfigurationProperty("type", IsRequired = false, DefaultValue = "General")]
        public string Type
        {
            get => (string)base["type"];
            set => base["password"] = value;
        }
    }
}

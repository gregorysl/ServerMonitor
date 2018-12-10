#tool nuget:?package=NUnit.ConsoleRunner&version=3.4.0
#addin "Cake.Yarn"
#addin "Cake.FileHelpers"
#addin nuget:?package=Cake.Json
#addin nuget:?package=Newtonsoft.Json&version=9.0.1
using System.Xml;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
//////////////////////////////////////////////////////////////////////
// ARGUMENTS
//////////////////////////////////////////////////////////////////////

var target = Argument("target", "Default");
var configuration = Argument("configuration", "Release");

//////////////////////////////////////////////////////////////////////
// PREPARATION
//////////////////////////////////////////////////////////////////////

var settingsJson = "./settings.json";
var webConfigFile = "./ServerMonitor/Web.config";
var json = JsonConvert.DeserializeObject<JObject>(FileReadText(settingsJson));

// Define directories.
var binDir = json["binDir"].ToString();
var localDir = "./ServerMonitor";
var webDistDir = "./Web/dist";
var releaseDir = "./Release";
var buildDir = Directory(binDir);

//////////////////////////////////////////////////////////////////////
// TASKS
//////////////////////////////////////////////////////////////////////

Task("Clean")
    .Does(() =>
{
    CleanDirectory(buildDir);
});

Task("Restore-NuGet-Packages")
    .IsDependentOn("Clean")
    .Does(() =>
{
    NuGetRestore("./ServerMonitor.sln");
});

Task("Build")
    .IsDependentOn("Restore-NuGet-Packages")
    .IsDependentOn("Transform-Configs")
    .Does(() =>
{
    if(IsRunningOnWindows())
    {
      MSBuild("./ServerMonitor.sln", settings =>
        settings.SetConfiguration(configuration));
    }
    else
    {
      XBuild("./ServerMonitor.sln", settings =>
        settings.SetConfiguration(configuration));
    }
});

Task("Prepare-Release-Dir")
	.IsDependentOn("Build")
	.Does(() => 
{
	CopyDirectory(webDistDir, localDir);
});

Task("Prepare-Local-Build")
	.IsDependentOn("Build")
	.Does(() => 
{
	CopyDirectory(binDir, releaseDir);
	CopyDirectory(webDistDir, releaseDir);
});

Task("Yarn")
	.Does(() => 
{
	Yarn.FromPath("./Web").Install();
	Yarn.FromPath("./Web").RunScript("production");
});
Task("Transform-Configs")
	.Does(() => 
{

            var fileToTranform = @"C:\Users\asd\source\repos\ConsoleApp1\ConsoleApp1\Web.config";
            var connectionString =
                "Data Source={0};Initial Catalog={1};Persist Security Info=True;User ID={2};Password={3}";
            XmlDocument doc = new XmlDocument();
            doc.Load(fileToTranform);


            var configurationNode = doc.ChildNodes[1];
            var webConfigTokens = json["webConfig"];

            var connectionNode = configurationNode.SelectSingleNode("connectionStrings/add");
            if (connectionNode?.Attributes != null)
            {
                connectionNode.Attributes["connectionString"].Value = string.Format(connectionString,
                    json["dataSource"],
                    json["database"], json["dbUser"], json["dbPassword"]);
            }

            var appSettings = configurationNode.SelectSingleNode("appSettings");
            appSettings.RemoveAll();
            foreach (var appsetting in webConfigTokens["appSettings"])
            {
                var setting = appsetting as JProperty;
                var xEl = doc.CreateElement("add");
                xEl.SetAttribute("key", setting.Name);
                xEl.SetAttribute("value", setting.Value.ToString());
                appSettings.AppendChild(xEl);
            }

            var linksList = configurationNode.SelectSingleNode("links");
            linksList.RemoveAll();
            foreach (var link in webConfigTokens["links"])
            {
                var xEl = doc.CreateElement("add");
                xEl.SetAttribute("name", link["name"].ToString());
                xEl.SetAttribute("url", link["url"].ToString());
                if (link["username"] != null)
                    xEl.SetAttribute("username", link["username"].ToString());
                if (link["password"] != null)
                    xEl.SetAttribute("password", link["password"].ToString());
                if (link["type"] != null)
                    xEl.SetAttribute("type", link["type"].ToString());
                linksList.AppendChild(xEl);
            }

            var hardwareList = configurationNode.SelectSingleNode("hardwareList");
            hardwareList.RemoveAll();
            foreach (var link in webConfigTokens["hardwareList"])
            {
                var xEl = doc.CreateElement("add");
                xEl.SetAttribute("name", link["name"].ToString());
                xEl.SetAttribute("url", link["url"].ToString());
                hardwareList.AppendChild(xEl);
            }

            doc.Save(fileToTranform);
});

//////////////////////////////////////////////////////////////////////
// TASK TARGETS
//////////////////////////////////////////////////////////////////////

Task("Local")
    .IsDependentOn("Yarn")
	.IsDependentOn("Prepare-Local-Build");
	
Task("Default")
    .IsDependentOn("Yarn")
	.IsDependentOn("Prepare-Release-Dir");

//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////

RunTarget(target);

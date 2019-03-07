#addin "Cake.FileHelpers"
#addin "Cake.Powershell"
#addin nuget:?package=Newtonsoft.Json
#addin nuget:?package=Cake.Npm
using System.Xml;
using Path = System.IO.Path;
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

var webConfigFile = "./ServerMonitor/Web.config";
var settings = JsonConvert.DeserializeObject<JObject>(FileReadText("./settings.json"));

var connectionString = "Data Source={0};Initial Catalog={1};Persist Security Info=True;User ID={2};Password={3}";
var binDir = "./ServerMonitor/bin";
var localDir = "./ServerMonitor";
var webDistDir = "./Web/build";
var releaseDir = "./Release";

//////////////////////////////////////////////////////////////////////
// TASKS
//////////////////////////////////////////////////////////////////////

Task("Clean")
    .Does(() =>
{
    CleanDirectory(binDir);
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
    .IsDependentOn("Restore-NuGet-Packages")
    .IsDependentOn("Transform-Configs")
	.Does(() => 
{
    MSBuild("./ServerMonitor/ServerMonitor.csproj", settings =>
        settings.UseToolVersion(MSBuildToolVersion.VS2017)
        .WithTarget("Package")                
        .WithProperty("TargetFrameworkVersion","4.7.1")
        .WithProperty("Configuration","Release")
        .WithProperty("AutoParameterizationWebConfigConnectionStrings", "False")
        .WithProperty("_PackageTempDir", "../Release")
        .WithProperty("SolutionDir","./ServerMonitor"));
	CopyDirectory(webDistDir, releaseDir);
});

Task("Create-Web-App")
	.IsDependentOn("Build")
    .IsDependentOn("Copy-Install-Script")
	.Does(() => 
{
    StartPowershellFile("./Release/Setup.ps1", args =>
        {
            args.Append("-copy:$false");
        });
});
Task("Prepare-Local-Build")
	.IsDependentOn("Create-Web-App")
	.Does(() => 
{
	CopyDirectory(webDistDir, releaseDir);
});

Task("Npm")
	.Does(() => 
{
    NpmInstall(s => s.FromPath("web"));
    CleanDirectory(webDistDir);
    NpmRunScript("build", s => s.FromPath("web"));
});

Task("Copy-Install-Script")
	.Does(() => 
{
    string releaseLocation = (target == "Default" || target == "Local") ?
					Path.GetFullPath("./ServerMonitor") :
					settings["releaseLocation"].ToString();
    var installScript = FileReadText("./Setup.ps1")
                    .Replace("##APPNAME##",settings["appName"].ToString())
                    .Replace("##USERNAME##",settings["userName"].ToString())
                    .Replace("##PASSWORD##",settings["password"].ToString())
                    .Replace("##LOCATION##",releaseLocation);
    FileWriteText(releaseDir+"/Setup.ps1",installScript);
});
Task("Transform-Configs")
	.Does(() => 
{
    var fileToTranform = localDir + "/Web.config";
    XmlDocument doc = new XmlDocument();
    doc.Load(fileToTranform);

    var configurationNode = doc.ChildNodes[1];

    var connectionNode = configurationNode.SelectSingleNode("connectionStrings/add");
    if (connectionNode?.Attributes != null)
    {
        connectionNode.Attributes["connectionString"].Value = string.Format(connectionString,
            settings["dataSource"],
            settings["database"], settings["dbUser"], settings["dbPassword"]);
    }

    var webConfigTokens = settings["webConfig"];
    var json = JsonConvert.SerializeObject(webConfigTokens, Newtonsoft.Json.Formatting.Indented);
    FileWriteText(localDir + "/settings.json",json);

    

    doc.Save(fileToTranform);
});

//////////////////////////////////////////////////////////////////////
// TASK TARGETS
//////////////////////////////////////////////////////////////////////

Task("Local")
    .IsDependentOn("Npm")
	.IsDependentOn("Prepare-Local-Build");

Task("Default")
    .IsDependentOn("Prepare-Local-Build");
	
Task("Api")
	.IsDependentOn("Prepare-Release-Dir")
    .IsDependentOn("Copy-Install-Script");
Task("Package")
    .IsDependentOn("Npm")
	.IsDependentOn("Prepare-Release-Dir")
    .IsDependentOn("Copy-Install-Script");

//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////

RunTarget(target);

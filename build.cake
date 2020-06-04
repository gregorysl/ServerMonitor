#addin nuget:?package=Cake.FileHelpers&version=3.2.1
#addin nuget:?package=Cake.Npm&version=0.17.0
#addin nuget:?package=Cake.Powershell&version=0.4.8
#addin nuget:?package=Newtonsoft.Json&version=12.0.2

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

var binDir = "./ServerMonitor/bin";
var objDir = "./ServerMonitor/obj";
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
    CleanDirectory(objDir);
    CleanDirectory(releaseDir);
});

Task("Restore-NuGet-Packages")
    .Does(() =>
{
    NuGetRestore("./ServerMonitor.sln");
});

Task("Create-Release")
    .IsDependentOn("Clean")
    .IsDependentOn("Restore-NuGet-Packages")
	.Does(() => 
{
    MSBuild("./ServerMonitor/ServerMonitor.csproj", settings =>
        settings.WithProperty("DeployOnBuild", "true")
        .WithProperty("Configuration","Release")
        .WithProperty("_PackageTempDir", "../Release")
        .WithProperty("SolutionDir","./ServerMonitor")
        .WithConsoleLoggerParameter("ErrorsOnly")
        );

	CopyDirectory(webDistDir, releaseDir);
    if((bool)settings["copyWebConfig"]){
        var webConfigTokens = settings["webConfig"];
        var json = JsonConvert.SerializeObject(webConfigTokens, Newtonsoft.Json.Formatting.Indented);
        FileWriteText(releaseDir + "/settings.json",json);
    }
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


//////////////////////////////////////////////////////////////////////
// TASK TARGETS
//////////////////////////////////////////////////////////////////////

Task("Package")
    .IsDependentOn("Npm")
	.IsDependentOn("Create-Release")
    .IsDependentOn("Copy-Install-Script");

//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////

RunTarget(target);

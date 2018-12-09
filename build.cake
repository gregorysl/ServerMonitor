#tool nuget:?package=NUnit.ConsoleRunner&version=3.4.0
#addin "Cake.Yarn"
#addin "Cake.FileHelpers"
#addin nuget:?package=Cake.Json
#addin nuget:?package=Newtonsoft.Json&version=9.0.1
using Newtonsoft.Json;
using System.Reflection;
using System.Windows;
//////////////////////////////////////////////////////////////////////
// ARGUMENTS
//////////////////////////////////////////////////////////////////////

var target = Argument("target", "Default");
var configuration = Argument("configuration", "Release");

//////////////////////////////////////////////////////////////////////
// PREPARATION
//////////////////////////////////////////////////////////////////////

var settingsLocation = Context.Environment.WorkingDirectory.CombineWithFilePath(FilePath.FromString("settings.json"));
var json = JsonConvert.DeserializeObject<Dictionary<string, string>>(FileReadText(settingsLocation));

// Define directories.
var binDir = json["binDir"];//"./ServerMonitor/bin";
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

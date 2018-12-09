#tool nuget:?package=NUnit.ConsoleRunner&version=3.4.0
#addin "Cake.Yarn"
//////////////////////////////////////////////////////////////////////
// ARGUMENTS
//////////////////////////////////////////////////////////////////////

var target = Argument("target", "Default");
var configuration = Argument("configuration", "Release");

//////////////////////////////////////////////////////////////////////
// PREPARATION
//////////////////////////////////////////////////////////////////////

// Define directories.
var binDir = "./ServerMonitor/bin";
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
      // Use MSBuild
      MSBuild("./ServerMonitor.sln", settings =>
        settings.SetConfiguration(configuration));
    }
    else
    {
      // Use XBuild
      XBuild("./ServerMonitor.sln", settings =>
        settings.SetConfiguration(configuration));
    }
});

Task("Prepare-Release-Dir")
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

Task("Default")
    .IsDependentOn("Yarn")
	.IsDependentOn("Prepare-Release-Dir");

//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////

RunTarget(target);

# Server Monitor

Simple tool to monitor server resources, manage IIS applications, check disk usage, run windows tasks and monitor user sessions

## Screenshot

<h1 align="center">
  <img src="screenshot.png?raw=true" alt="Server Monitor"/></a>
</h1>

## Getting started

Open `settings.json` file and fill settings

### Local build

1. Run Powershell in main dir
2. Run command `.\build.ps1 -target Local`

### Production build

1. Run Powershell in main dir
2. Run command `.\build.ps1 -target Package`
3. Copy contents of `./Release` to server
4. Run `.\Setup.ps1`
5. Finished!

### Other options

`.\build.ps1 -target Api` Builds only API project, and creates package
`.\build.ps1` Builds only API for local purposes

## Settings explained

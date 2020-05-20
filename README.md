# Server Monitor

Simple tool to monitor server resources, manage IIS applications, check disk usage, run windows tasks and monitor user sessions

## Screenshot

<h1 align="center">
  <img src="screenshot.png?raw=true" alt="Server Monitor"/>
</h1>

## Overview

- **IIS application monitoring**
  - Group by name
  - Turn on/off groupped application pools
  - Turn on/off individual application pools
  - Recycle application pool
  - Whitelist application (to prevent it from being cleaned up)
  - Adding notes to a build
- **Hardware monitoring**
  - Displays CPU usage graph
  - Displays RAM usage graph
  - Displays HDD space graph
- **Link Checker**
  - Display status of links configured in settings
- **Scheduled Tasks**
  - Display status of configured tasks
  - Run tasks
- **User Sessions**
  - List currently logged in users on maching
  - Ability to sign off disconnected users
- **Oracle Instances**
  - List oracle instances, and their status
  - Reserve instance to prevent overwriting
- **Disk status**
  - how much space configured directories occupy

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

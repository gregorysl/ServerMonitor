# Server Monitor

Monitor server resources, manage IIS applications, check disk usage, run windows tasks and monitor user sessions

## Screenshot

<img src="screenshot.png?raw=true" alt="Server Monitor"/>

## Overview

- **Multiple server monitoring**
  - Each configured server will have all capabilities on following functions
    - IIS application monitoring
    - Hardware monitoring
    - Link Checker
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

- Open `settings.json` file and fill settings
- Run Powershell in main dir
- Run command `.\build.ps1 -target Package`
- Copy contents of `./Release` to server
- Run `.\Setup.ps1`
- Finished!

## Installer Settings

<!-- prettier-ignore -->
| Name | type | Description |
| ---- | ------ | ---- |
| **appName** | string | Name of application and application pool on IIS|
| **userName** | string | Name of user with admin rights to be set on app pool|
| **password** | string | Password of user with admin rights to be set on app pool|
| **releaseLocation** | string | Place where Server Monitor will be located|
| **copyWebConfig** | bool   | Handles logic for creating `settings.json` file in Release dir.<br>Set to false if previous version already exists on server |

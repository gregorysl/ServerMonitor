param([switch]$copy)
Import-Module WebAdministration
$iisAppPoolName = "##APPNAME##"
$userName = "##USERNAME##"
$password = "##PASSWORD##"
$directoryPath = "##LOCATION##"
$copyText = If ($copy) { "with" } Else { "without" }
Write-Host "Setting up $iisAppPoolName $copyText copying files in location $directoryPath"
$initialPath = $((Get-Item -Path "./").FullName)

if ($copy) {
    if (-Not (Test-Path $directoryPath)) {
        Write-Host "Destination directory not found. Creating."
        New-Item -Path $directoryPath -ItemType "directory"
    }

    Write-Host "Copying files to destination folder"
    Copy-item -Force -Recurse "$initialPath\*" -Destination $directoryPath
    Write-Host "Files copied successfully"
}

Set-Location IIS:\AppPools\

if ((Test-Path "$iisAppPoolName" -pathType container)) {
    Write-Host "App Pool already exists. Removing"
    Remove-WebAppPool $iisAppPoolName
}
Write-Host "Creating and setting up app pool"
$appPool = New-Item $iisAppPoolName

$appPool | Set-ItemProperty -Name "managedRuntimeVersion" -Value "v4.0"
$appPool | Set-ItemProperty -Name "startMode" -Value "AlwaysRunning"
$appPool | Set-ItemProperty -Name processModel.idleTimeout -value ( [TimeSpan]::FromMinutes(0))
$appPool | Set-ItemProperty -Name Recycling.periodicRestart.time -Value "00:00:00"
$appPool | Set-ItemProperty -Name processModel -value @{userName = $userName; password = $password; identitytype = 3 }
Write-Host "App Pool setup finished. Creating web application"
$null = New-WebApplication -Name $iisAppPoolName -ApplicationPool $iisAppPoolName -Site "Default Web Site" -PhysicalPath $directoryPath -Force;
Write-Host "Web application created"

Start-WebAppPool $iisAppPoolName
Write-Host "Setup finished!"
Set-Location $initialPath
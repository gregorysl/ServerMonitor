param([switch]$copy)

Import-Module WebAdministration
$initialPath = $((Get-Item -Path "./").FullName)
$iisAppPoolName = "##APPNAME##"
$userName = "##USERNAME##"
$password = "##PASSWORD##"
$directoryPath = "##LOCATION##"

if ($copy) {
    if (-Not (Test-Path $directoryPath)) {
        mkdir -path $directoryPath
    }

    Copy-item -Force -Recurse "$initialPath\*" -Destination $directoryPath
}

cd IIS:\AppPools\

if ((Test-Path "$iisAppPoolName" -pathType container)) {
    Remove-WebAppPool $iisAppPoolName
}
$appPool = New-Item $iisAppPoolName

$appPool | Set-ItemProperty -Name "managedRuntimeVersion" -Value "v4.0"
$appPool | Set-ItemProperty -Name "startMode" -Value "AlwaysRunning"
$appPool | Set-ItemProperty -Name processModel.idleTimeout -value ( [TimeSpan]::FromMinutes(0))
$appPool | Set-ItemProperty -Name Recycling.periodicRestart.time -Value "00:00:00"
$appPool | Set-ItemProperty -Name processModel -value @{userName = $userName; password = $password; identitytype = 3}
$app = New-WebApplication -Name $iisAppPoolName -ApplicationPool $iisAppPoolName -Site "Default Web Site" -PhysicalPath $directoryPath -Force;

Start-WebAppPool $iisAppPoolName

cd $initialPath
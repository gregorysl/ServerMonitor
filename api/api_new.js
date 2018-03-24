import Axios from 'axios';
import baseUri from './baseUri';

const appUri = `${baseUri}/ServerMonitor/`;
const apiUri = `${appUri}Monitor/`;
const oracleUri = `${apiUri}GetOracleInstances`;
const tasksUri = `${appUri}Tasks/GetScheduledTasks`;
const runTasksUri = `${appUri}Tasks/Toggle`;
const sessionsUri = `${apiUri}GetUserSesssions`;
const diskUri = `${apiUri}GetDiskUsage`;
const hardwareUri = `${appUri}Hardware/GetHardware`;
const iisUri = `${appUri}Iis/Get`;
const iisStopUri = `${appUri}Iis/Toggle`;
const iisWhitelistUri = `${appUri}Iis/WhitelistToggle`;
const servicesStopUri = `${appUri}Links/Get`;

export function setIisApp(appList) {
  return Axios.post(iisStopUri, appList);
}

export function whitelistApp(appList) {
  return Axios.post(iisWhitelistUri, appList);
}

export function runTask(name) {
  return Axios.post(runTasksUri, { name });
}

export function getServices() {
  return Axios.get(servicesStopUri);
}

export function getHardware() {
  return Axios.get(hardwareUri);
}


export function getIisApps() {
  return Axios.get(iisUri);
}

export function getDisk() {
  return Axios.get(diskUri);
}

export function getTasks() {
  return Axios.get(tasksUri);
}

export function getUserSessions() {
  return Axios.get(sessionsUri);
}

export function getOracleInstancies() {
  return Axios.get(oracleUri);
}

import Axios from 'axios';

let appUri = 'http://localhost/ServerMonitor/';
if (process.env.NODE_ENV === 'production') {
  appUri = document.location.href;
}

const apiUri = `${appUri}Monitor/`;
const oracleUri = `${apiUri}GetOracleInstances`;
const sessionsUri = `${apiUri}GetUserSesssions`;
const diskUri = `${apiUri}GetDiskUsage`;
const setOracleUri = `${apiUri}SetOracleInstanceReserved`;
const tasksUri = `${appUri}Tasks/`;
const runTasksUri = `${appUri}Tasks/`;
// const hardwareUri = `${appUri}Hardware/`;
const hardwareUri = `${appUri}Hardware/GetAll`;
const iisUri = `${appUri}Iis/`;
const iisStopUri = `${appUri}Iis/Toggle`;
const iisWhitelistUri = `${appUri}Iis/WhitelistToggle`;
const servicesStopUri = `${appUri}Links/`;

export function setIisApp(appList) {
  return Axios.post(iisStopUri, JSON.stringify(appList), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export function setOracle(data) {
  return Axios.post(setOracleUri, data);
}

export function whitelistApp(appList) {
  return Axios.post(iisWhitelistUri, appList);
}

export function runTask(name) {
  return Axios.post(runTasksUri, `'${name}'`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
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

export function setNote(data) {
  return Axios.post(`${appUri}Iis/SaveBuildNote`, data);
}

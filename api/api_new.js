import Axios from 'axios';
import baseUri from './baseUri';

const appUri = `${baseUri}/ServerMonitor/`;
const apiUri = `${appUri}Monitor/`;
const oracleUri = `${apiUri}GetOracleInstances`;
const tasksUri = `${appUri}Tasks/GetScheduledTasks`;
const sessionsUri = `${apiUri}GetUserSesssions`;
const diskUri = `${apiUri}GetDiskUsage`;
const hardwareUri = `${appUri}Hardware/GetHardware`;
const iisUri = `${appUri}Iis/Get`;
const iisStopUri = `${appUri}Iis/Toggle`;

export function setIisApp(appList) {
  return Axios.post(iisStopUri, appList);
}

export function getServices() {
  return [{
    key: 'Fdim', working: false, message: "An error occurred while sending the request.\\r\\nThe remote name could not be resolved: 'propp-jav.com'\\r\\n", url: 'https://propp-jav.com:8083/MessageBroker/ping'
  }, {
    key: 'ElasticSearch', working: false, message: 'Unauthorized', url: 'https://localhost:9200/'
  }, {
    key: 'Google', working: true, message: 'OK', url: 'https://www.google.com/'
  }];
}

export function getHardware() {
  return Axios.get(hardwareUri).then(x => JSON.parse(x.data));
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

import Axios from 'axios';
import baseUri from './baseUri';

const apiUri = `${baseUri}/ServerMonitor/Monitor/`;
const oracleUri = `${apiUri}GetOracleInstances?order=asc`;
const tasksUri = `${apiUri}GetScheduledTasks`;
const sessionsUri = `${apiUri}GetUserSesssions`;
const diskUri = `${apiUri}GetDiskUsage`;
const hardwareUri = `${baseUri}/ServerMonitor/Hardware/GetHardware`;
const iisUri = `${apiUri}/GetIisApplications`;
const iisStopUri = `${apiUri}/Stop`;

// function getIissDatas() {
//   const iisData = '';
//   console.log(iisData);
//   return JSON.parse(iisData);
// }
export function setIisApp(appName) {
  debugger;
  return Axios.post(iisStopUri, appName).then(x => JSON.parse(x.data));

  // const data = getIissDatas();
  // Object.keys(data.data).forEach((key) => {
  //   Object.keys(data.data[key]).forEach((subkey) => {
  //     if (subkey === 'key' && data.data[key][subkey] === appName) {
  //       const state = data.data[key].state === 'Started' ? 'Stopped' : 'Started';
  //       data.data[key].state = state;
  //       Object.keys(data.data[key].apps).forEach((app) => {
  //         data.data[key].apps[app].state = state;
  //       });
  //     }
  //   });
  // });
  // const iisData = JSON.stringify(data);
}
const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i += 1) {
    arr.push(i);
  }
  return arr;
};

export function getServices() {
  return range(5).map(d => ({
    key: d,
    url: 'test',
    name: `test ${d}`,
    message: 'working'
  }));
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

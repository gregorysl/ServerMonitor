import Axios from 'axios';
import baseUri from './baseUri';

const apiUri = `${baseUri}/ServerMonitor/Monitor/`;
const oracleUri = `${apiUri}GetOracleInstances?order=asc`;
const tasksUri = `${apiUri}GetScheduledTasks`;
const sessionsUri = `${apiUri}GetUserSesssions`;
const diskUri = `${apiUri}GetDiskUsage`;

let iisData =
  '{"columns":[{"title":"Application","dataIndex":"key","key":"key"},{"title":"Stat'
  + 'e","dataIndex":"state","key":"state"}],"data":[{"key":"Application 0","state":"S'
  + 'topped","note":"","apps":[{"key":"chilren app 0 0","state":"Started"},{"key":"ch'
  + 'ilren app 0 1","state":"Started"},{"key":"chilren app 0 2","state":"Stopped"}]},'
  + '{"key":"Application 1","state":"Stopped","note":"","apps":[{"key":"chilren app 1'
  + ' 0","state":"Started"},{"key":"chilren app 1 1","state":"Started"},{"key":"chilr'
  + 'en app 1 2","state":"Stopped"}]},{"key":"Application 2","state":"Started","note"'
  + ':"","apps":[{"key":"chilren app 2 0","state":"Started"},{"key":"chilren app 2 1"'
  + ',"state":"Stopped"},{"key":"chilren app 2 2","state":"Stopped"}]},{"key":"Applic'
  + 'ation 3","state":"Stopped","note":"","apps":[{"key":"chilren app 3 0","state":"S'
  + 'topped"},{"key":"chilren app 3 1","state":"Started"},{"key":"chilren app 3 2","s'
  + 'tate":"Started"}]},{"key":"Application 4","state":"Started","note":"","apps":[{"'
  + 'key":"chilren app 4 0","state":"Stopped"},{"key":"chilren app 4 1","state":"Stop'
  + 'ped"},{"key":"chilren app 4 2","state":"Stopped"}]}]}';

function getIissDatas() {
  return JSON.parse(iisData);
}
export function setIisApp(appName) {
  const data = getIissDatas();
  Object.keys(data.data).forEach((key) => {
    Object.keys(data.data[key]).forEach((subkey) => {
      if (subkey === 'key' && data.data[key][subkey] === appName) {
        const state = data.data[key].state === 'Started' ? 'Stopped' : 'Started';
        data.data[key].state = state;
        Object.keys(data.data[key].apps).forEach((app) => {
          data.data[key].apps[app].state = state;
        });
      }
    });
  });
  iisData = JSON.stringify(data);
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
  return range(2).map(d => ({
    key: `Server ${d}`,
    data: range(3).map(x => ({
      key: `Hardware ${x}`,
      value: Math.floor(Math.random() * 100)
    }))
  }));
}


export function getIisApps() {
  return getIissDatas();
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

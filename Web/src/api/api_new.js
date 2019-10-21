import Axios from "axios";

let appUri = "http://localhost/ServerMonitor/";
if (process.env.NODE_ENV === "production") {
  let href = document.location.href;
  const hashLocation = href.indexOf("#");
  if (hashLocation !== -1) {
    href = href.substring(0, href.indexOf("#"));
  }
  appUri = href;
}

const apiUri = `${appUri}Monitor/`;
const oracleUri = `${appUri}OracleInstance`;
const sessionsUri = `${appUri}Sessions`;
const diskUri = `${apiUri}GetDiskUsage`;
const setOracleUri = `${appUri}OracleInstanceReservation`;
const tasksUri = `${appUri}Tasks/`;
const settingsUri = `${appUri}Settings/`;

export function getIisApp(url) {
  return Axios.get(`${url}Iis`);
}
export function setIisApp(props) {
  return Axios.post(`${props.url}/Iis`, props.appList);
}

export function recycleApp(props) {
  return Axios.post(`${props.url}/Iis?name=${props.name}`);
}

export function getHardware(url) {
  return Axios.get(`${url}Hardware`);
}

export function getIisApps(prefix) {
  const url = prefix ? prefix : appUri;
  return Axios.get(`${url}Iis/`);
}

export function getDisk() {
  return Axios.get(diskUri);
}

export function getOracleInstancies() {
  return Axios.get(oracleUri);
}

export function setOracle(data) {
  return Axios.put(setOracleUri, data);
}

export function getUserSessions() {
  return Axios.get(`${sessionsUri}`);
}

export function killUser(data) {
  return Axios.delete(`${sessionsUri}/${data}`);
}

export function getTasks() {
  return Axios.get(tasksUri);
}

export function runTask(name) {
  return Axios.post(`${tasksUri}/${name}`);
}

export function getSettings(force) {
  const forceParam = !!force ? "?force=true" : "";
  return Axios.get(settingsUri + forceParam);
}

export function setSettings(settings) {
  return Axios.put(settingsUri, settings);
}

export function checkLink(data, url) {
  return Axios.post(`${url}Links`, data);
}

export function getServerLinks(url) {
  return Axios.get(`${url}Settings`);
}

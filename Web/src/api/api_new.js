import ky from "ky";

const makeOptions = data => {
  return {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  };
};
async function get(url) {
  let data = null;
  try {
    const response = await ky.get(url);
    data = handleResponse(response);
  } catch (error) {
    console.log({ error });
    data = {
      responseStatus: "Error",
      status: error.response.status,
      data: "",
      notifications: [{ message: error.message }]
    };
  } finally {
    return data;
  }
}

async function put(url, data) {
  const response = await ky.put(url, makeOptions(data));
  return handleResponse(response);
}

async function post(url, data) {
  const response = await ky.post(url, makeOptions(data));
  return handleResponse(response);
}
async function del(url) {
  const response = await ky.delete(url);
  return handleResponse(response);
}

async function handleResponse(response) {
  const responseData = await response.json();
  responseData.status = response.status;
  return responseData;
}

let appUri = "http://localhost/ServerMonitor/";
if (process.env.NODE_ENV === "production") {
  let href = document.location.href;
  const hashLocation = href.indexOf("#");
  if (hashLocation !== -1) {
    href = href.substring(0, href.indexOf("#"));
  }
  appUri = href;
}

const oracleUri = `${appUri}OracleInstance`;
const sessionsUri = `${appUri}Sessions`;
const diskUri = `${appUri}Monitor/GetDiskUsage`;
const setOracleUri = `${appUri}OracleInstanceReservation`;
const tasksUri = `${appUri}Tasks/`;
const settingsUri = `${appUri}Settings/`;

export function getIisApp(url) {
  return get(`${url}Iis`);
}
export function setIisApp(props) {
  return post(`${props.url}Iis`, props.appList);
}

export function recycleApp(props) {
  return post(`${props.url}Iis?name=${props.name}`);
}

export function getHardware(url) {
  return get(`${url}Hardware`);
}

export function getIisApps(prefix) {
  const url = prefix ? prefix : appUri;
  return get(`${url}Iis/`);
}

export function getDisk() {
  return get(diskUri);
}

export function getOracleInstancies() {
  return get(oracleUri);
}

export async function setOracle(data) {
  let oracleData = null;
  try {
    const response = await ky.put(setOracleUri, makeOptions(data));
    oracleData = {
      responseStatus: "Success",
      status: response.status,
      data: "",
      notifications: [{ message: "Reserved status changed" }]
    };
  } catch (error) {
    console.log({ error });
    oracleData = {
      responseStatus: "Error",
      status: error.response.status,
      data: "",
      notifications: [{ message: error.message }]
    };
  } finally {
    return oracleData;
  }
}

export function getUserSessions() {
  return get(`${sessionsUri}`);
}

export function killUser(data) {
  return del(`${sessionsUri}/${data}`);
}

export function getTasks() {
  return get(tasksUri);
}

export function runTask(name) {
  return post(`${tasksUri}/${name}`);
}

export function getSettings(force, customUrl) {
  const url = customUrl ? customUrl : settingsUri;
  const forceParam = !!force ? "?force=true" : "";
  return get(url + forceParam);
}

export function setSettings(settings) {
  return put(settingsUri, settings);
}

export function checkLink(data, url) {
  return post(`${url}Links`, data);
}

export function getServerLinks(url) {
  return get(`${url}Settings`);
}
export async function getHeartbeat(url) {
  const response = await ky.get(`${url}Heartbeat`, {
    throwHttpErrors: false,
    retry: 1
  });
  return !response ? { status: 999 } : response;
}

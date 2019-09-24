import * as types from "../constants/actionTypes";

export const getHardwareAction = () => ({
  type: types.GET_HARDWARE_DATA_REQUEST
});

export const getIisAction = url => ({
  type: types.GET_IIS_APPS_REQUEST,
  url
});

export const setIisAction = (appList, url) => ({
  type: types.GET_IIS_TOGGLE_REQUEST,
  appList,
  url
});

export const recycleApp = (name, url) => ({
  type: types.GET_IIS_RECYCLE_REQUEST,
  name,
  url
});

export const getDiskUsageAction = () => ({
  type: types.DISK_USAGE_REQUEST
});

export const getTasksAction = () => ({
  type: types.TASKS_REQUEST
});

export const getSessionsAction = () => ({
  type: types.SESSIONS_REQUEST
});

export const getOracleAction = () => ({
  type: types.ORACLE_REQUEST
});

export const runTask = name => ({
  type: types.TASKS_RUN_REQUEST,
  name
});

export const setOracle = data => ({
  type: types.TOGGLE_ORACLE_REQUEST,
  data
});

export const killSession = name => ({
  type: types.SESSIONS_KILL_REQUEST,
  name
});

export const getSettings = force => ({
  type: types.GET_SETTINGS_REQUEST,
  force
});

export const setSettings = settings => ({
  type: types.SET_SETTINGS_REQUEST,
  settings
});

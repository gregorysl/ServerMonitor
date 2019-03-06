import * as types from '../constants/actionTypes';

export const getServicesAction = () => ({
  type: types.GET_SERVICES_DATA_REQUEST
});

export const getHardwareAction = () => ({
  type: types.GET_HARDWARE_DATA_REQUEST
});

export const getIisAction = data => ({
  type: types.GET_IIS_APPS_REQUEST,
  data
});

export const setIisAction = appList => ({
  type: types.GET_IIS_TOGGLE_REQUEST,
  appList
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

export const whitelistApp = list => ({
  type: types.GET_IIS_WHITELIST_REQUEST,
  list
});
export const recycleApp = name => ({
  type: types.GET_IIS_RECYCLE_REQUEST,
  name
});

export const runTask = name => ({
  type: types.TASKS_RUN_REQUEST,
  name
});

export const setOracle = data => ({
  type: types.TOGGLE_ORACLE_REQUEST,
  data
});

export const setNote = data => ({
  type: types.SET_NOTE_REQUEST,
  data
});

export const killSession = name => ({
  type: types.SESSIONS_KILL_REQUEST,
  name
});

export const getSettings = () => ({
  type: types.GET_SETTINGS_REQUEST
});

export const setCleanerSettings = (settings) => ({
  type: types.SET_CLEANER_REQUEST,
  settings
});

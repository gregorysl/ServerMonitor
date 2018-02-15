import * as types from '../constants/actionTypes';

export const getServicesAction = () => ({
  type: types.GET_SERVICES_DATA_REQUEST
});

export const getHardwareAction = () => ({
  type: types.GET_HARDWARE_DATA_REQUEST
});

export const getIisAction = () => ({
  type: types.GET_IIS_APPS_REQUEST
});

export const setIisAction = appName => ({
  type: types.GET_IIS_TOGGLE_REQUEST,
  appName
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

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

import * as types from '../constants/actionTypes';

export const selectImageAction = count => ({
  type: types.GET_TABLE_DATA_REQUEST,
  count
});

export const getServicesAction = () => ({
  type: types.GET_SERVICES_DATA_REQUEST
});


export const getHardwareAction = () => ({
  type: types.GET_HARDWARE_DATA_REQUEST
});

export const getIisAction = () => ({
  type: types.GET_IIS_APPS_REQUEST
});

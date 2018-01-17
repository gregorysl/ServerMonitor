import * as types from '../constants/actionTypes';

export const selectImageAction = count => ({
  type: types.GET_TABLE_DATA_REQUEST,
  count,
});

export const getServicesAction = () => ({
  type: types.GET_SERVICES_DATA_REQUEST,
});

import * as types from '../constants/actionTypes';

export const selectImageAction = (count) => ({
    type: types.GET_TABLE_DATA_REQUEST,
    count
  });
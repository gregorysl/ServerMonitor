import { takeLatest } from 'redux-saga/effects';
import { getTableData, getServicesData } from './tableSagas';
import * as types from '../constants/actionTypes';

export function* watchGetTable() {
  yield takeLatest(types.GET_TABLE_DATA_REQUEST, getTableData);
}
export function* watchGetServices() {
  yield takeLatest(types.GET_TABLE_DATA_REQUEST, getServicesData);
}

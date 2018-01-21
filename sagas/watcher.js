import { takeLatest } from 'redux-saga/effects';
import { getTableData, getServicesData, getHardwareData } from './tableSagas';
import * as types from '../constants/actionTypes';

export function* watchGetTable() {
  yield takeLatest(types.GET_TABLE_DATA_REQUEST, getTableData);
}
export function* watchGetServices() {
  yield takeLatest(types.GET_TABLE_DATA_REQUEST, getServicesData);
}
export function* watchGetHardware() {
  yield takeLatest(types.GET_HARDWARE_DATA_REQUEST, getHardwareData);
}

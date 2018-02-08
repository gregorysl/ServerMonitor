import { takeLatest } from 'redux-saga/effects';
import * as saga from './tableSagas';
import * as types from '../constants/actionTypes';

export function* watchGetServices() {
  yield takeLatest(types.GET_SERVICES_DATA_REQUEST, saga.getServicesData);
}
export function* watchGetHardware() {
  yield takeLatest(types.GET_HARDWARE_DATA_REQUEST, saga.getHardwareData);
}
export function* watchGetIis() {
  yield takeLatest(types.GET_IIS_APPS_REQUEST, saga.getIisData);
}
export function* watchSetIis() {
  yield takeLatest(types.GET_IIS_TOGGLE_REQUEST, saga.setIisApp);
}

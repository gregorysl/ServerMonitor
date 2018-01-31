import { put, call } from 'redux-saga/effects';
import * as api from '../api/api';
import * as types from '../constants/actionTypes';

export function* getTableData({ payload }) {
  try {
    const data = yield call(api.getPeople, payload);
    yield put({ type: types.GET_TABLE_DATA_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.GET_TABLE_DATA_ERROR, error });
  }
}

export function* getServicesData({ payload }) {
  try {
    const data = yield call(api.getServices, payload);
    yield put({ type: types.GET_SERVICES_DATA_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.GET_SERVICES_DATA_ERROR, error });
  }
}

export function* getHardwareData() {
  try {
    const data = yield call(api.getHardware);
    yield put({ type: types.GET_HARDWARE_DATA_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.GET_HARDWARE_DATA_ERROR, error });
  }
}

export function* getIisData() {
  try {
    const data = yield call(api.getIisApps);
    yield put({ type: types.GET_IIS_APPS_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.GET_IIS_APPS_ERROR, error });
  }
}

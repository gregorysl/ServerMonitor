import { put, call } from 'redux-saga/effects';
import { getPeople, getServices, getHardware } from '../api/api';
import * as types from '../constants/actionTypes';

export function* getTableData({ payload }) {
  try {
    const data = yield call(getPeople, payload);
    yield put({ type: types.GET_TABLE_DATA_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.GET_TABLE_DATA_ERROR, error });
  }
}

export function* getServicesData({ payload }) {
  try {
    const data = yield call(getServices, payload);
    yield put({ type: types.GET_SERVICES_DATA_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.GET_SERVICES_DATA_ERROR, error });
  }
}

export function* getHardwareData() {
  try {
    const data = yield call(getHardware);
    yield put({ type: types.GET_HARDWARE_DATA_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.GET_HARDWARE_DATA_ERROR, error });
  }
}

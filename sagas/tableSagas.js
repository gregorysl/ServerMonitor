import { put, call } from 'redux-saga/effects';
import * as api from '../api/api';
import * as types from '../constants/actionTypes';

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
export function* setIisApp(props) {
  try {
    const data1 = yield call(api.setIisApp, props.appName);
    yield put({ type: types.GET_IIS_TOGGLE_SUCCESS, data1 });
    const data = yield call(api.getIisApps);
    yield put({ type: types.GET_IIS_APPS_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.GET_IIS_TOGGLE_ERROR, error });
  }
}

export function* getDiskUsageData() {
  try {
    const data = yield call(api.getDisk);
    yield put({ type: types.DISK_USAGE_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.DISK_USAGE_ERROR, error });
  }
}


export function* getTasksData() {
  try {
    const data = yield call(api.getTasks);
    yield put({ type: types.TASKS_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.TASKS_ERROR, error });
  }
}

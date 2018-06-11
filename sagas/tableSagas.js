import { put, call } from 'redux-saga/effects';
import * as api from '../api/api_new';
import * as types from '../constants/actionTypes';

export function* getServicesData({ payload }) {
  try {
    const { data } = yield call(api.getServices, payload);
    yield put({ type: types.GET_SERVICES_DATA_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.GET_SERVICES_DATA_ERROR, error });
  }
}

export function* getHardwareData() {
  try {
    const { data } = yield call(api.getHardware);
    if (data.data.constructor === Object) {
      data.data = [data.data];
    }
    yield put({ type: types.GET_HARDWARE_DATA_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.GET_HARDWARE_DATA_ERROR, error });
  }
}

export function* getIisData() {
  try {
    const { data } = yield call(api.getIisApps);
    yield put({ type: types.GET_IIS_APPS_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.GET_IIS_APPS_ERROR, data: error.response.data });
  }
}

export function* setIisApp(props) {
  try {
    const { data } = yield call(api.setIisApp, props.appList);
    yield put({ type: types.GET_IIS_TOGGLE_SUCCESS, data });
    yield put({ type: types.GET_IIS_APPS_REQUEST });
  } catch (error) {
    yield put({ type: types.GET_IIS_TOGGLE_ERROR, data: error.response.data });
  }
}

export function* setIisAppWhitelist(props) {
  try {
    const { data } = yield call(api.whitelistApp, props.list);
    yield put({ type: types.GET_IIS_WHITELIST_SUCCESS, data });
    yield put({ type: types.GET_IIS_APPS_REQUEST });
  } catch (error) {
    yield put({ type: types.GET_IIS_WHITELIST_ERROR, data: error.response.data });
  }
}

export function* setOracle(props) {
  try {
    const data1 = yield call(api.setOracle, props.data);
    yield put({ type: types.TOGGLE_ORACLE_SUCCESS, message: data1.data.message });
    const data = yield call(api.getOracleInstancies);
    yield put({ type: types.ORACLE_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.TOGGLE_ORACLE_ERROR, error });
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
    const { data } = yield call(api.getTasks);
    const type = data.status === 'Success' ? types.TASKS_SUCCESS : types.TASKS_ERROR;
    yield put({ type, data });
  } catch (error) {
    yield put({ type: types.TASKS_ERROR, error });
  }
}

export function* getSessionsData() {
  try {
    const { data } = yield call(api.getUserSessions);
    yield put({ type: types.SESSIONS_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.SESSIONS_ERROR, error });
  }
}

export function* getOracleData() {
  try {
    const data = yield call(api.getOracleInstancies);
    yield put({ type: types.ORACLE_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.ORACLE_ERROR, error });
  }
}

export function* runTask(props) {
  try {
    const data = yield call(api.runTask, props.name);
    yield put({ type: types.TASKS_RUN_SUCCESS, message: data.data.Message });
  } catch (error) {
    yield put({ type: types.TASKS_RUN_ERROR, error });
  }
}

export function* setNote(props) {
  try {
    const data1 = yield call(api.setNote, props.data);
    yield put({ type: types.TOGGLE_ORACLE_SUCCESS, message: data1.data.message });
    yield put({ type: types.GET_IIS_APPS_REQUEST });
  } catch (error) {
    yield put({ type: types.TOGGLE_ORACLE_ERROR, error });
  }
}

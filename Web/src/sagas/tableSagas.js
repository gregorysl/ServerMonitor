import { put, call } from 'redux-saga/effects';
import * as api from '../api/api_new';
import * as types from '../constants/actionTypes';

export function* getServicesData({ payload }) {
  try {
    const { data } = yield call(api.getServices, payload);
    yield put({ type: types.GET_SERVICES_DATA_SUCCESS, data });
  } catch (error) {
    yield put({
      type: types.GET_SERVICES_DATA_ERROR,
      data: error.response.data
    });
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
    yield put({
      type: types.GET_HARDWARE_DATA_ERROR,
      data: error.response.data
    });
  }
}

export function* getIisData(props) {
  try {
    const { data } = yield call(api.getIisApps, props.data);
    yield put({ type: types.GET_IIS_APPS_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.GET_IIS_APPS_ERROR, data: error.response.data });
  }
}

export function* setIisApp(props) {
  try {
    const { data } = yield call(api.setIisApp, props.appList);
    yield put({ type: types.GET_IIS_TOGGLE_SUCCESS, data });
    yield put({ type: types.GET_IIS_APPS_REQUEST, data: true });
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
    yield put({
      type: types.GET_IIS_WHITELIST_ERROR,
      data: error.response.data
    });
  }
}
export function* setIisAppRecycle(props) {
  try {
    const { data } = yield call(api.recycleApp, props.name);
    yield put({ type: types.GET_IIS_RECYCLE_SUCCESS, data });
    yield put({ type: types.GET_IIS_APPS_REQUEST });
  } catch (error) {
    yield put({ type: types.GET_IIS_RECYCLE_ERROR, data: error.response.data });
  }
}

export function* setOracle(props) {
  try {
    const { data } = yield call(api.setOracle, props.data);
    const type =
      data.status === 'Success'
        ? types.TOGGLE_ORACLE_SUCCESS
        : types.TOGGLE_ORACLE_ERROR;
    yield put({ type, data });
    yield put({ type: types.ORACLE_REQUEST });
  } catch (error) {
    yield put({ type: types.TOGGLE_ORACLE_ERROR, data: error.response.data });
  }
}

export function* getDiskUsageData() {
  try {
    const { data } = yield call(api.getDisk);
    yield put({ type: types.DISK_USAGE_SUCCESS, data });
  } catch (error) {    
    yield put({ type: types.DISK_USAGE_ERROR, data: error.response.data });
  }
}

export function* getTasksData() {
  try {
    const { data } = yield call(api.getTasks);
    const type =
      data.status === 'Success' ? types.TASKS_SUCCESS : types.TASKS_ERROR;
    yield put({ type, data });
  } catch (error) {
    yield put({ type: types.TASKS_ERROR, data: error.response.data });
  }
}

export function* getSessionsData() {
  try {
    const { data } = yield call(api.getUserSessions);
    yield put({ type: types.SESSIONS_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.SESSIONS_ERROR, data: error.response.data });
  }
}

export function* getOracleData() {
  try {
    const { data } = yield call(api.getOracleInstancies);
    const type =
      data.status === 'Success' ? types.ORACLE_SUCCESS : types.ORACLE_ERROR;
    yield put({ type, data });
  } catch (error) {
    yield put({ type: types.ORACLE_ERROR, data: error.response.data });
  }
}

export function* runTask(props) {
  try {
    const { data } = yield call(api.runTask, props.name);
    yield put({ type: types.TASKS_RUN_SUCCESS, data });
    yield put({ type: types.TASKS_REQUEST });
  } catch (error) {
    yield put({ type: types.TASKS_RUN_ERROR, data: error.response.data });
  }
}

export function* setNote(props) {
  try {
    const { data } = yield call(api.setNote, props.data);
    yield put({ type: types.SET_NOTE_SUCCESS, data });
    yield put({ type: types.GET_IIS_APPS_REQUEST });
  } catch (error) {
    yield put({ type: types.SET_NOTE_ERROR, data: error.response.data });
  }
}

export function* setKillUser(props) {
  try {
    const { data } = yield call(api.killUser, props.name);
    yield put({ type: types.SESSIONS_KILL_SUCCESS, data });
    yield put({ type: types.SESSIONS_REQUEST });
  } catch (error) {
    yield put({ type: types.SESSIONS_KILL_ERROR, data: error.response.data });
  }
}

export function* getSettings() {
  try {
    const { data } = yield call(api.getSettings);
    yield put({ type: types.GET_SETTINGS_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.GET_SETTINGS_ERROR, data: error.response.data });
  }
}

export function* setCleanerSettings(props) {
  try {
    const { data } = yield call(api.setCleanerSettings, props.settings);
    yield put({ type: types.GET_SETTINGS_REQUEST });
    yield put({ type: types.SET_CLEANER_SUCCESS, data });
  } catch (error) {
    yield put({ type: types.SET_CLEANER_ERROR, data: error.response.data });
  }
}

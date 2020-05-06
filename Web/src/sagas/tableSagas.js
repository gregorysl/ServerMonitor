import { put, call } from "redux-saga/effects";
import * as api from "../api/api_new";
import * as types from "../constants/actionTypes";

function prepareErrorObject(type, notifications) {
  const notify = notifications.map(x => {
    return { message: x.message, type: "Error", status: "Error" };
  });
  return {
    type: type,
    data: {
      notifications: notify
    }
  };
}

export function* getHardwareData(props) {
  const data = yield call(api.getHardware, props.url);
  if (data.status !== 200) {
    const errorType = types.GET_HARDWARE_DATA_ERROR;
    yield put(prepareErrorObject(errorType, data.notifications));
  } else {
    yield put({
      type: types.GET_HARDWARE_DATA_SUCCESS,
      data,
      name: props.name
    });
  }
}

export function* getIisData(props) {
  const data = yield call(api.getIisApp, props.url);
  if (data.status !== 200) {
    const errorType = types.GET_IIS_APPS_ERROR;
    yield put(prepareErrorObject(errorType, data.notifications));
  } else {
    yield put({
      type: types.GET_IIS_APPS_SUCCESS,
      data,
      url: props.url
    });
  }
}

export function* setIisApp(props) {
  const data = yield call(api.setIisApp, props);
  if (data.status !== 200) {
    const errorType = types.GET_IIS_TOGGLE_ERROR;
    yield put(prepareErrorObject(errorType, data.notifications));
  } else {
    yield put({ type: types.GET_IIS_TOGGLE_SUCCESS, data });
    yield put({ type: types.GET_IIS_APPS_REQUEST, url: props.url });
  }
}

export function* setIisAppRecycle(props) {
  const data = yield call(api.recycleApp, props);
  if (data.status !== 200) {
    const errorType = types.GET_IIS_RECYCLE_ERROR;
    yield put(prepareErrorObject(errorType, data.notifications));
  } else {
    yield put({ type: types.GET_IIS_RECYCLE_SUCCESS, data });
    yield put({ type: types.GET_IIS_APPS_REQUEST, url: props.url });
  }
}

export function* setOracle(props) {
  const data = yield call(api.setOracle, props.data);
  if (![200, 204].includes(data.status)) {
    const errorType = types.TOGGLE_ORACLE_ERROR;
    yield put(prepareErrorObject(errorType, data.notifications));
  } else {
    yield put({ type: types.ORACLE_REQUEST });
  }
}

export function* getDiskUsageData() {
  const data = yield call(api.getDisk);
  if (data.status !== 200) {
    const errorType = types.DISK_USAGE_ERROR;
    yield put(prepareErrorObject(errorType, data.notifications));
  } else {
    yield put({
      type: types.DISK_USAGE_SUCCESS,
      data
    });
  }
}

export function* getTasksData() {
  const data = yield call(api.getTasks);
  if (data.status !== 200) {
    const errorType = types.TASKS_ERROR;
    yield put(prepareErrorObject(errorType, data.notifications));
  } else {
    yield put({
      type: types.TASKS_SUCCESS,
      data
    });
  }
}

export function* getSessionsData() {
  const data = yield call(api.getUserSessions);
  if (data.status !== 200) {
    const errorType = types.SESSIONS_ERROR;
    yield put(prepareErrorObject(errorType, data.notifications));
  } else {
    yield put({
      type: types.SESSIONS_SUCCESS,
      data
    });
  }
}

export function* getOracleData() {
  const data = yield call(api.getOracleInstancies);
  if (data.status !== 200) {
    const errorType = types.ORACLE_ERROR;
    yield put(prepareErrorObject(errorType, data.notifications));
  } else {
    yield put({
      type: types.ORACLE_SUCCESS,
      data
    });
  }
}

export function* runTask(props) {
  const data = yield call(api.runTask, props.name);
  if (data.status !== 200) {
    const errorType = types.TASKS_RUN_ERROR;
    yield put(prepareErrorObject(errorType, data.notifications));
  } else {
    yield put({ type: types.TASKS_RUN_SUCCESS, data });
    yield put({ type: types.TASKS_REQUEST });
  }
}

export function* setKillUser(props) {
  const data = yield call(api.killUser, props.name);
  if (data.status !== 200) {
    const errorType = types.SESSIONS_KILL_ERROR;
    yield put(prepareErrorObject(errorType, data.notifications));
  } else {
    yield put({ type: types.SESSIONS_KILL_SUCCESS, data });
    yield put({ type: types.SESSIONS_REQUEST });
  }
}

export function* getSettings() {
  const data = yield call(api.getSettings);
  if (data.status !== 200) {
    const errorType = types.GET_SETTINGS_ERROR;
    yield put(prepareErrorObject(errorType, data.notifications));
  } else {
    yield put({ type: types.GET_SETTINGS_SUCCESS, data });
  }
}

export function* setSettings(props) {
  const data = yield call(api.setSettings, props.settings);
  if (data.status !== 200) {
    const errorType = types.GET_SETTINGS_ERROR;
    yield put(prepareErrorObject(errorType, data.notifications));
  } else {
    yield put({ type: types.GET_SETTINGS_REQUEST, force: true });
    yield put({ type: types.SET_SETTINGS_SUCCESS, data });
  }
}

export function* getHeartbeat(props) {
  const data = yield call(api.getHeartbeat, props.url);
  if (data.status === 200) {
    yield put({ type: types.GET_HEARTBEAT_SUCCESS, data: props.name });
  } else {
    yield put({
      type: types.GET_HEARTBEAT_ERROR,
      data: props.name
    });
  }
}

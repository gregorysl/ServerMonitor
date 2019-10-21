import { takeLatest, takeEvery } from "redux-saga/effects";
import * as saga from "./tableSagas";
import * as types from "../constants/actionTypes";

export function* watchGetHardware() {
  yield takeEvery(types.GET_HARDWARE_DATA_REQUEST, saga.getHardwareData);
}

export function* watchGetIis() {
  yield takeEvery(types.GET_IIS_APPS_REQUEST, saga.getIisData);
}

export function* watchSetIis() {
  yield takeLatest(types.GET_IIS_TOGGLE_REQUEST, saga.setIisApp);
}

export function* watchRecycleIis() {
  yield takeLatest(types.GET_IIS_RECYCLE_REQUEST, saga.setIisAppRecycle);
}

export function* watchDiskUsage() {
  yield takeLatest(types.DISK_USAGE_REQUEST, saga.getDiskUsageData);
}

export function* watchTasks() {
  yield takeLatest(types.TASKS_REQUEST, saga.getTasksData);
}

export function* watchSessions() {
  yield takeLatest(types.SESSIONS_REQUEST, saga.getSessionsData);
}

export function* watchOracle() {
  yield takeLatest(types.ORACLE_REQUEST, saga.getOracleData);
}

export function* watchRunTask() {
  yield takeLatest(types.TASKS_RUN_REQUEST, saga.runTask);
}

export function* watchSetOracle() {
  yield takeLatest(types.TOGGLE_ORACLE_REQUEST, saga.setOracle);
}

export function* watchKillUser() {
  yield takeLatest(types.SESSIONS_KILL_REQUEST, saga.setKillUser);
}

export function* watchGetSettings() {
  yield takeLatest(types.GET_SETTINGS_REQUEST, saga.getSettings);
}

export function* watchSetCleanerSettings() {
  yield takeLatest(types.SET_SETTINGS_REQUEST, saga.setSettings);
}

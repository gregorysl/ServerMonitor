import { takeLatest } from 'redux-saga/effects';
import { getTableData } from './tableSagas';
import * as types from '../constants/actionTypes';

export function* watchGetTable() {
  yield takeLatest(types.GET_TABLE_DATA_REQUEST, getTableData);
}
export function* watchGetTable2() {
  yield takeLatest(types.GET_TABLE_DATA_REQUEST, getTableData);
}

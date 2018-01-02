import { takeLatest } from 'redux-saga/effects'
import { getTableData } from './tableSagas'
import * as types from '../constants/actionTypes';

export default function* watchGetTable(){
    yield takeLatest(types.GET_TABLE_DATA_REQUEST, getTableData);
}

import { all, fork } from 'redux-saga/effects';
import { watchGetTable, watchGetServices } from './watcher';

export default function* () {
  yield all([
    fork(watchGetTable),
    fork(watchGetServices),
  ]);
}

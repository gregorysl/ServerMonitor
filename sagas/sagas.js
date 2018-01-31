import { all, fork } from 'redux-saga/effects';
import * as watch from './watcher';

export default function* () {
  yield all([
    fork(watch.watchGetServices),
    fork(watch.watchGetHardware),
    fork(watch.watchGetIis)
  ]);
}

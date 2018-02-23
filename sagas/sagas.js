import { fork } from 'redux-saga/effects';
import * as watch from './watcher';

const sagas = [
  fork(watch.watchGetServices),
  fork(watch.watchGetHardware),
  fork(watch.watchGetIis),
  fork(watch.watchSetIis),
  fork(watch.watchDiskUsage),
  fork(watch.watchTasks),
  fork(watch.watchSessions),
  fork(watch.watchOracle)
];

export default function* () {
  yield sagas;
}

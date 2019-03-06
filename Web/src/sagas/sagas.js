import { all, fork } from 'redux-saga/effects';
import * as watch from './watcher';

const sagas = [
  fork(watch.watchGetServices),
  fork(watch.watchGetHardware),
  fork(watch.watchGetIis),
  fork(watch.watchSetIis),
  fork(watch.watchRecycleIis),
  fork(watch.watchDiskUsage),
  fork(watch.watchTasks),
  fork(watch.watchSessions),
  fork(watch.watchOracle),
  fork(watch.watchRunTask),
  fork(watch.watchIisWhitelist),
  fork(watch.watchSetOracle),
  fork(watch.watchSetNote),
  fork(watch.watchKillUser),
  fork(watch.watchGetSettings),
  fork(watch.watchSetCleanerSettings)
];

export default function* () {
  yield all(sagas);
}

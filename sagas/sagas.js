import { fork } from 'redux-saga/effects';
import { watchGetTable } from './watcher';

export default function* () {
  yield [
    fork(watchGetTable),
  ];
}

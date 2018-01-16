import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers/reducers';
import sagas from '../sagas/sagas';

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  return {
    ...createStore(
      rootReducer,
      applyMiddleware(sagaMiddleware),
    ),
    runSaga: sagaMiddleware.run(sagas),
  };
};

const store = configureStore();

export default store;

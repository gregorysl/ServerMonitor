import { combineReducers } from 'redux';
import * as types from '../constants/actionTypes';

const initialState = {
  data: [],
};

const tableInitialState = {
  columns: [],
  data: [],
};

function tableReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.GET_TABLE_DATA_SUCCESS:
      return { ...state, ...action.data };
    default:
      return state;
  }
}

function servicesReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_SERVICES_DATA_SUCCESS:
      return { ...state, data: action.data };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  table: tableReducer,
  service: servicesReducer,
});

export default rootReducer;

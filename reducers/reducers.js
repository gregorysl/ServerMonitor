import { combineReducers } from 'redux';
import * as types from '../constants/actionTypes';

const initialState = {
  data: [],
};

function tableReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_TABLE_DATA_SUCCESS:
      return { ...state, data: action.data };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  table: tableReducer,
});

export default rootReducer;

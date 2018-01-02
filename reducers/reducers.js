import { combineReducers } from 'redux'
import * as types from '../constants/actionTypes';

const initialState = {
    data: []
  };

const tableReducer =  function (state = initialState.data,action){
      switch(action.type){
          case types.GET_TABLE_DATA_SUCCESS:
            return [...state, action.data];
          default:
          return state;
      }
};

const rootReducer = combineReducers({tableReducer});

export default rootReducer;
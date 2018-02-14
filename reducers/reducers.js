import { combineReducers } from 'redux';
import * as types from '../constants/actionTypes';

const diskColumns = [
  { title: 'Path', dataIndex: 'Path', key: 'Path' },
  { title: 'Size', dataIndex: 'Size', key: 'Size' },
  { title: 'Usage', dataIndex: 'Usage', key: 'Usage' }
];
const tasksColumns = [
  { title: 'Name', dataIndex: 'Name', key: 'Name' },
  { title: 'State', dataIndex: 'State', key: 'State' },
  { title: 'Path', dataIndex: 'Path', key: 'Path' },
  { title: 'LastRunTime', dataIndex: 'LastRunTime', key: 'LastRunTime' },
  { title: 'LastTaskResult', dataIndex: 'LastTaskResult', key: 'LastTaskResult' }
];

const hardwareInitialState = [];
const initialState = {
  data: []
};

const tableInitialState = {
  columns: [],
  data: []
};

function tableReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.GET_IIS_APPS_SUCCESS:
      return { ...state, ...action.data };
    default:
      return state;
  }
}

function diskUsageReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.DISK_USAGE_SUCCESS:
      return { ...state, ...action.data, columns: diskColumns };
    default:
      return state;
  }
}

function tasksReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.TASKS_SUCCESS:
      return { ...state, ...action.data, columns: tasksColumns };
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

function hardwareReducer(state = hardwareInitialState, action) {
  switch (action.type) {
    case types.GET_HARDWARE_DATA_SUCCESS:
      return [...action.data];
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  table: tableReducer,
  service: servicesReducer,
  hardware: hardwareReducer,
  disk: diskUsageReducer,
  tasks: tasksReducer
});

export default rootReducer;

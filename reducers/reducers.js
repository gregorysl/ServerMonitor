import { combineReducers } from 'redux';
import * as types from '../constants/actionTypes';

const iisColumns = [
  { title: 'Application', dataIndex: 'key', key: 'key' },
  {
    title: 'State', dataIndex: 'running', key: 'running', render: running => (running ? 'Started' : 'Stopped')
  }
];
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
const oracleColumns = [
  { title: 'Name', dataIndex: 'CurrentBuildName', key: 'CurrentBuildName' },
  { title: 'Date', dataIndex: 'CurrentBuildDate', key: 'CurrentBuildDate' },
  { title: 'Instance', dataIndex: 'DisplayName', key: 'DisplayName' },
  { title: 'Reserved', dataIndex: 'IsReserved', key: 'IsReserved' }
];
const sessionsColumns = [
  { title: 'User', dataIndex: 'User', key: 'User' },
  { title: 'LoginDate', dataIndex: 'LoginDate', key: 'LoginDate' },
  { title: 'State', dataIndex: 'State', key: 'State' }
];

const hardwareInitialState = [];
const initialState = {
  data: [],
  errors: []
};

const tableInitialState = {
  columns: [],
  data: [],
  errors: []
};
const oracleInstanciesErrorText = 'Oracle Instancies';
const userSessionsErrorText = 'User Sessions';
const tasksErrorText = 'Tasks';
const diskUsageErrorText = 'Disk Usage';
const iisErrorText = 'IIS Applications';

function tableReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.GET_IIS_APPS_SUCCESS:
      return { ...state, data: action.data.data, columns: iisColumns };
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

function sessionsReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.SESSIONS_SUCCESS:
      return { ...state, ...action.data, columns: sessionsColumns };
    default:
      return state;
  }
}

function oracleReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.ORACLE_SUCCESS:
      return { ...state, ...action.data, columns: oracleColumns };
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

function errorReducer(state = [], action) {
  switch (action.type) {
    case types.ORACLE_ERROR:
      return [...state, {
        title: oracleInstanciesErrorText,
        error: action.error.message
      }];
    case types.DISK_USAGE_ERROR:
      return [...state, {
        title: diskUsageErrorText,
        error: action.error.message
      }];
    case types.TASKS_ERROR:
      return [...state, {
        title: tasksErrorText,
        error: action.error.message
      }];
    case types.SESSIONS_ERROR:
      return [...state, {
        title: userSessionsErrorText,
        error: action.error.message
      }];
    case types.GET_IIS_APPS_ERROR:
      return [...state, {
        title: iisErrorText,
        error: action.error.message
      }];
    case types.GET_IIS_TOGGLE_SUCCESS:
      return [...state, {
        title: iisErrorText,
        error: action.message
      }];
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  table: tableReducer,
  service: servicesReducer,
  hardware: hardwareReducer,
  disk: diskUsageReducer,
  tasks: tasksReducer,
  sessions: sessionsReducer,
  oracle: oracleReducer,
  errors: errorReducer
});

export default rootReducer;

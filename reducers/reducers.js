import { combineReducers } from 'redux';
import * as types from '../constants/actionTypes';

const filesize = require('filesize');

const diskColumns = [
  { title: 'Path', dataIndex: 'path', key: 'path' },
  {
    title: 'Size', dataIndex: 'size', key: 'size', render: size => (size !== '' ? filesize(size) : '')
  },
  {
    title: 'Usage', dataIndex: 'usage', key: 'usage', render: usage => `${usage}%`
  }
];
const tasksColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'State', dataIndex: 'state', key: 'state' },
  { title: 'Last Run Time', dataIndex: 'lastRunTime', key: 'lastRunTime' },
  { title: 'Last Result', dataIndex: 'lastTaskResult', key: 'lastTaskResult' }
];
const oracleColumns = [
  { title: 'name', dataIndex: 'currentBuildName', key: 'currentBuildName' },
  { title: 'Date', dataIndex: 'currentBuildDate', key: 'currentBuildDate' },
  { title: 'Instance', dataIndex: 'displayName', key: 'displayName' }
];
const sessionsColumns = [
  { title: 'User', dataIndex: 'user', key: 'user' },
  { title: 'Login Date', dataIndex: 'loginDate', key: 'loginDate' },
  { title: 'State', dataIndex: 'state', key: 'state' }
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
      return { ...state, data: action.data.data };
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
      return { ...state, data: action.data.data };
    default:
      return state;
  }
}

function hardwareReducer(state = hardwareInitialState, action) {
  switch (action.type) {
    case types.GET_HARDWARE_DATA_SUCCESS:
      return [...action.data.data];
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
    case types.TASKS_RUN_ERROR:
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
    case types.GET_IIS_TOGGLE_ERROR:
      return [...state, {
        title: iisErrorText,
        error: action.error.message
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

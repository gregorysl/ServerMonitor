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
    case types.DISK_USAGE_ERROR:
      return {
        ...state,
        errors: state.errors.concat({
          title: diskUsageErrorText,
          error: action.error.message
        })
      };
    default:
      return state;
  }
}

function tasksReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.TASKS_SUCCESS:
      return { ...state, ...action.data, columns: tasksColumns };
    case types.TASKS_ERROR:
      return {
        ...state,
        errors: state.errors.concat({
          title: tasksErrorText,
          error: action.error.message
        })
      };
    default:
      return state;
  }
}

function sessionsReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.SESSIONS_SUCCESS:
      return { ...state, ...action.data, columns: sessionsColumns };
    case types.SESSIONS_ERROR:
      return {
        ...state,
        errors: state.errors.concat({
          title: userSessionsErrorText,
          error: action.error.message
        })
      };
    default:
      return state;
  }
}

function oracleReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.ORACLE_SUCCESS:
      return { ...state, ...action.data, columns: oracleColumns };
    case types.ORACLE_ERROR:
      return {
        ...state,
        errors: state.errors.concat({
          title: oracleInstanciesErrorText,
          error: action.error.message
        })
      };
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
  tasks: tasksReducer,
  sessions: sessionsReducer,
  oracle: oracleReducer
});

export default rootReducer;

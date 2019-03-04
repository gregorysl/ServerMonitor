import { combineReducers } from "redux";
import filesize from "filesize";
import dateformat from "dateformat";
import * as types from "../constants/actionTypes";

const diskColumns = [
  { Header: "Path", accessor: "path" },
  {
    Header: "Size",
    accessor: "size",
    Cell: size => (size.value !== "" ? filesize(size.value) : "")
  },
  {
    Header: "Usage",
    accessor: "usage",
    Cell: usage => `${usage.value}%`
  }
];
const tasksColumns = [
  { Header: "Name", accessor: "name" },
  { Header: "State", accessor: "state" },
  { Header: "Last Run Time", accessor: "lastRunTime" },
  { Header: "Last Result", accessor: "lastTaskResult" }
];
const oracleColumns = [
  { Header: "Name", accessor: "currentBuildName" },
  {
    Header: "Date",
    accessor: "currentBuildDate",
    Cell: date => dateformat(date.value, "dd.mm.yyyy, dddd")
  },
  { Header: "Instance", accessor: "displayName" }
];
const sessionsColumns = [
  { Header: "User", accessor: "user" },
  { Header: "Login Date", accessor: "loginDate" },
  { Header: "State", accessor: "state" }
];

const hardwareInitialState = [];
const initialState = {
  data: [],
  errors: [],
  loading: true
};

const tableInitialState = {
  columns: [],
  data: [],
  errors: [],
  loading: true
};
const oracleInstanciesErrorText = "Oracle Instancies";
const userSessionsErrorText = "User Sessions";
const tasksErrorText = "Tasks";
const hardwareErrorText = "Hardware Monitor";
const diskUsageErrorText = "Disk Usage";
const iisErrorText = "IIS Applications";
const linksErrorText = "Links";
const noteErrorText = "Build Notes";

function tableReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.GET_IIS_TOGGLE_REQUEST:
      return { ...state, loading: true };
    case types.GET_IIS_APPS_SUCCESS:
      return { ...state, data: action.data.data, loading: false };
    default:
      return state;
  }
}

function diskUsageReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.DISK_USAGE_SUCCESS:
      return {
        ...state,
        ...action.data,
        columns: diskColumns,
        loading: false
      };
    default:
      return state;
  }
}

function tasksReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.TASKS_SUCCESS:
      return {
        ...state,
        data: action.data.data,
        columns: tasksColumns,
        loading: false
      };
    case types.TASKS_RUN_REQUEST:
      return {
        ...state,
        loading: true
      };
    case types.TASKS_ERROR:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}

function sessionsReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.SESSIONS_SUCCESS:
      return {
        ...state,
        data: action.data.data,
        columns: sessionsColumns,
        loading: false
      };
    case types.SESSIONS_KILL_REQUEST:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}

function oracleReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.ORACLE_SUCCESS:
      if (!action.data.data) {
        return {
          isDisabled: true,
          loading: false
        };
      }

      return {
        ...state,
        data: action.data.data,
        columns: oracleColumns,
        isDisabled: false,
        loading: false
      };

    case types.ORACLE_ERROR:
      return {
        ...state,
        isDisabled: true,
        loading: false
      };
    case types.TOGGLE_ORACLE_REQUEST:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}

function servicesReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_SERVICES_DATA_SUCCESS:
      return { ...state, data: action.data.data, loading: false };
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

function settingsReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_SETTINGS_SUCCESS:
      return {data:action.data.data};
    default:
      return state;
  }
}

function addAllNotifications(stateArray, notifications, message) {
  if (!notifications) {
    return [
      ...stateArray,
      {
        message,
        description: "404",
        type: "Error"
      }
    ];
  }
  const toAdd = notifications.map(x => ({
    message,
    description: x.message,
    type: x.status
  }));
  return [...stateArray, ...toAdd];
}

function errorReducer(state = [], action) {
  let title = "";
  switch (action.type) {
    case types.TASKS_ERROR:
    case types.TASKS_SUCCESS:
    case types.TASKS_RUN_ERROR:
    case types.TASKS_RUN_SUCCESS:
      title = tasksErrorText;
      break;
    case types.GET_HARDWARE_DATA_SUCCESS:
    case types.GET_HARDWARE_DATA_ERROR:
      title = hardwareErrorText;
      break;
    case types.GET_SERVICES_DATA_SUCCESS:
    case types.GET_SERVICES_DATA_ERROR:
      title = linksErrorText;
      break;
    case types.SET_NOTE_SUCCESS:
    case types.SET_NOTE_ERROR:
      title = noteErrorText;
      break;
    case types.ORACLE_ERROR:
    case types.TOGGLE_ORACLE_ERROR:
    case types.TOGGLE_ORACLE_SUCCESS:
      title = oracleInstanciesErrorText;
      break;
    case types.DISK_USAGE_ERROR:
      title = diskUsageErrorText;
      break;
    case types.SESSIONS_ERROR:
    case types.SESSIONS_KILL_SUCCESS:
    case types.SESSIONS_KILL_ERROR:
      title = userSessionsErrorText;
      break;
    case types.GET_IIS_APPS_ERROR:
    case types.GET_IIS_APPS_SUCCESS:
    case types.GET_IIS_TOGGLE_SUCCESS:
    case types.GET_IIS_TOGGLE_ERROR:
    case types.GET_IIS_WHITELIST_ERROR:
    case types.GET_IIS_WHITELIST_SUCCESS:
    case types.GET_IIS_RECYCLE_ERROR:
    case types.GET_IIS_RECYCLE_SUCCESS:
      title = iisErrorText;
      break;
    default:
      title = "";
  }
  if (title === "") return state;

  return addAllNotifications(state, action.data.notifications, title);
}

const rootReducer = combineReducers({
  table: tableReducer,
  service: servicesReducer,
  hardware: hardwareReducer,
  disk: diskUsageReducer,
  tasks: tasksReducer,
  sessions: sessionsReducer,
  oracle: oracleReducer,
  errors: errorReducer,
  settings: settingsReducer
});

export default rootReducer;

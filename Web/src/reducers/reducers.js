import { combineReducers } from "redux";
import filesize from "filesize";
import dateformat from "dateformat";
import * as types from "../constants/actionTypes";

const diskColumns = [
  { title: "Path", dataIndex: "path", key: "path" },
  {
    title: "Size",
    dataIndex: "size",
    render: (size) => (size !== "" ? filesize(size) : ""),
  },
  {
    title: "Usage",
    dataIndex: "usage",
    key: "usage",
    render: (usage) => `${usage}%`,
  },
];
const tasksColumns = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "State", dataIndex: "state", key: "state" },
  { title: "Last Run Time", dataIndex: "lastRunTime", key: "lastRunTime" },
  { title: "Last Result", dataIndex: "lastTaskResult", key: "lastTaskResult" },
];
const oracleColumns = [
  { title: "Name", dataIndex: "currentBuildName" },
  {
    title: "Date",
    dataIndex: "currentBuildDate",
    Cell: (date) => dateformat(date.value, "dd.mm.yyyy, dddd"),
  },
  { title: "Instance", dataIndex: "displayName" },
];
const sessionsColumns = [
  { title: "User", dataIndex: "user", key: "user" },
  { title: "Login Date", dataIndex: "loginDate", key: "loginDate" },
  { title: "State", dataIndex: "state", key: "state" },
];

const tableInitialState = {
  columns: [],
  keys: [],
  data: [],
  errors: [],
};
const oracleInstanciesErrorText = "Oracle Instancies";
const userSessionsErrorText = "User Sessions";
const tasksErrorText = "Tasks";
const hardwareErrorText = "Hardware Monitor";
const diskUsageErrorText = "Disk Usage";
const settingsErrorText = "Settings";
const iisErrorText = "IIS Applications";

function tableReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.GET_IIS_APPS_SUCCESS:
      if (action.data.responseStatus != "Success") return state;
      let newKeys = [...state.keys];
      let newData = [...state.data];
      let keyIndex = newKeys.indexOf(action.url);
      if (keyIndex !== -1) {
        newKeys.splice(keyIndex, 1);
        newData.splice(keyIndex, 1);
      }
      newKeys.push(action.url);
      newData.push(action.data.data);

      let newState = {
        ...state,
        keys: newKeys,
        data: newData,
      };
      return newState;
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
        loaded: true,
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
        loaded: true,
      };
    case types.TASKS_RUN_REQUEST:
      return {
        ...state,
      };
    case types.TASKS_ERROR:
      return {
        ...state,
        loaded: true,
      };
    default:
      return state;
  }
}

function sessionsReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.SESSIONS_SUCCESS:
      let newState = {
        ...state,
        columns: sessionsColumns,
        loaded: true,
      };
      if (action.data.responseStatus === "Success")
        newState.data = action.data.data;
      return newState;
    default:
      return state;
  }
}

function oracleReducer(state = tableInitialState, action) {
  switch (action.type) {
    case types.ORACLE_SUCCESS:
      if (!action.data.data) {
        return {
          columns: oracleColumns,
          loaded: true,
        };
      }

      return {
        ...state,
        data: action.data.data,
        columns: oracleColumns,
        loaded: true,
      };

    case types.ORACLE_ERROR:
      return {
        ...state,
        columns: oracleColumns,
        loaded: true,
      };
    case types.TOGGLE_ORACLE_REQUEST:
      return {
        ...state,
        loaded: false,
      };
    default:
      return state;
  }
}

function hardwareReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_HARDWARE_DATA_SUCCESS:
      if (action.data.responseStatus != "Success") return state;
      const newState = { ...state };
      const data = action.data.data;

      if (Object.keys(newState).indexOf(action.name) === -1) {
        newState[action.name] = { data: [] };
      }
      var current = newState[action.name].data;
      let newItem = {};
      for (var x in data) {
        newItem[data[x].key] = data[x].value;
      }
      current.push(newItem);
      newState[action.name].data = current.slice(-10);
      newState[action.name].current = data;
      return newState;
    default:
      return state;
  }
}

function heartbeatReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_HEARTBEAT_REQUEST:
      const newStateReq = { ...state };
      if (Object.keys(newStateReq).indexOf(action.name) === -1) {
        newStateReq[action.name] = { loaded: false, loading: true };
        return { ...newStateReq };
      }
      return state;
    case types.GET_HEARTBEAT_ERROR:
    case types.GET_HEARTBEAT_SUCCESS:
      const newState = { ...state };
      const working = action.type === types.GET_HEARTBEAT_SUCCESS;
      newState[action.data] = { loading: false, loaded: true, working };
      return { ...newState };
    default:
      return state;
  }
}

function settingsReducer(
  state = {
    hardwareList: [],
    links: [],
    dirsToCheckSize: [],
    scheduledTasks: [],
    cleaner: {},
  },
  action
) {
  switch (action.type) {
    case types.GET_SETTINGS_SUCCESS:
      return { ...state, ...action.data.data, loaded: true };
    default:
      return state;
  }
}

function refreshReducer(state = {}, { type, url }) {
  switch (type) {
    case types.GET_IIS_APPS_REQUEST:
      const newState = { ...state };
      const act = newState[url];
      if (!act) {
        newState[url] = 0;
      }
      newState[url]++;
      return newState;
    default:
      return state;
  }
}

function addAllNotifications(stateArray, notifications, message) {
  let id = stateArray.id;
  if (!notifications) {
    return {
      id: id + 1,
      data: [
        ...stateArray,
        {
          message,
          description: "404",
          type: "Error",
        },
      ],
    };
  }
  const toAdd = notifications.map((x) => ({
    id: id++,
    message,
    description: x.message,
    type: x.responseStatus,
  }));
  return { id: id + 1, data: [...toAdd] };
}

function errorReducer(state = { id: 0, data: [] }, action) {
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
    case types.GET_IIS_RECYCLE_ERROR:
    case types.GET_IIS_RECYCLE_SUCCESS:
      title = iisErrorText;
      break;
    case types.SET_SETTINGS_SUCCESS:
    case types.SET_SETTINGS_ERROR:
    case types.GET_SETTINGS_ERROR:
      title = settingsErrorText;
      break;
    default:
      title = "";
  }
  if (title === "") return state;

  return addAllNotifications(state, action.data.notifications, title);
}

const rootReducer = combineReducers({
  refresh: refreshReducer,
  table: tableReducer,
  hardware: hardwareReducer,
  disk: diskUsageReducer,
  tasks: tasksReducer,
  sessions: sessionsReducer,
  oracle: oracleReducer,
  errors: errorReducer,
  settings: settingsReducer,
  heartbeat: heartbeatReducer,
});

export default rootReducer;

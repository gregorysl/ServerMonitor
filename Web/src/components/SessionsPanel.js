import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../actions/actions";
import DataTable from "./Iis/DataTable";
import SessionsActionButtons from "./SessionsActionButtons";

const sessionActions = {
  accessor: "x",
  Cell: row => <SessionsActionButtons {...row.original} />,
  width: 100
};

const SessionsPanel = props => {
  const dispatch = useDispatch();
  const sessions = useSelector(state => state.sessions);
  if (!sessions.loaded) {
    dispatch(actions.getSessionsAction());
  }
  return (
    <DataTable
      {...sessions}
      title="User Sessions"
      extraColumns={[sessionActions]}
    />
  );
};

export default SessionsPanel;

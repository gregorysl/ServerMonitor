import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../actions/actions";
import DataTable from "./Iis/DataTable";
import SessionsActionButtons from "./SessionsActionButtons";

const SessionsPanel = props => {
  const dispatch = useDispatch();
  const sessions = useSelector(state => state.sessions);
  const sessionActions = {
    accessor: "x",
    Cell: row => (
      <SessionsActionButtons
        click={() => dispatch(actions.killSession(row.original.id))}
        state={row.original.state}
      />
    ),
    width: 100
  };
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

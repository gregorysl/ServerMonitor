import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../actions/actions";
import DataTable from "./Iis/DataTable";
import TooltipButton from "./TooltipButton";

const SessionsPanel = props => {
  const dispatch = useDispatch();
  const sessions = useSelector(state => state.sessions);
  const sessionActions = {
    accessor: "x",
    Cell: row =>
      row.original.state !== "Active" && (
        <TooltipButton
          click={() => dispatch(actions.killSession(row.original.id))}
          icon="user-delete"
          tooltip="Log off user"
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

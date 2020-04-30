import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSessionsAction, killSession } from "../actions/actions";
import DataTable from "./Iis/DataTable";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";

const SessionsPanel = props => {
  const dispatch = useDispatch();
  const sessions = useSelector(state => state.sessions);
  useEffect(() => {
    if (!sessions.loaded) {
      dispatch(getSessionsAction());
    }
  }, [dispatch, sessions.loaded]);
  const actions = [
    rowData => ({
      icon: () => <ExitToAppOutlinedIcon />,
      tooltip: "Log off user",
      onClick: (event, row) => dispatch(killSession(row.id)),
      hidden: rowData.state === "Active"
    })
  ];

  return (
    <DataTable {...sessions} title="User Sessions" extraColumns={actions} />
  );
};

export default SessionsPanel;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "./actions/actions";
import DataTable from "./components/Iis/DataTable";
import ServerData from "./components/Iis/ServerData";
import SessionsPanel from "./components/SessionsPanel";
import TasksPanel from "./components/TasksPanel";
import OraclePanel from "./components/OraclePanel";

const Home = props => {
  const { settings, disk } = useSelector(state => state);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.getDiskUsageAction());
  }, [dispatch, disk.loaded]);

  const data = settings.hardwareList.map(x => (
    <ServerData key={x.name} name={x.name} url={x.url} />
  ));
  return (
    <div style={{ background: "#fff", padding: 5, height: "100%" }}>
      <h1 className="table-title">IIS Applications</h1>
      {data}

      <OraclePanel />
      <DataTable {...disk} title="Disk Status" />
      <TasksPanel />
      <SessionsPanel />
    </div>
  );
};
Home.defaultProps = { isDisabled: true, data: [], columns: [] };

export default Home;

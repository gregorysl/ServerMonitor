import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "./actions/actions";
import DataTable from "./components/Iis/DataTable";
import ServerData from "./components/Iis/ServerData";
import SessionsPanel from "./components/SessionsPanel";
import TasksPanel from "./components/TasksPanel";
import OraclePanel from "./components/OraclePanel";
import Grid from "@material-ui/core/Grid";

const Home = props => {
  const { settings, disk } = useSelector(state => state);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.getDiskUsageAction());
  }, [dispatch, disk.loaded]);

  const data = settings.hardwareList.map(x => (
    <Grid key={x.name} item xs={12}>
      <ServerData name={x.name} url={x.url} />
    </Grid>
  ));
  return (
    <Grid container spacing={3}>
      {data}
      <Grid item xs={12}>
        <OraclePanel />
      </Grid>
      <Grid item xs={12}>
        <DataTable {...disk} title="Disk Status" />
      </Grid>
      <Grid item xs={12}>
        <TasksPanel />
      </Grid>
      <Grid item xs={12}>
        <SessionsPanel />
      </Grid>
    </Grid>
  );
};
Home.defaultProps = { isDisabled: true, data: [], columns: [] };

export default Home;

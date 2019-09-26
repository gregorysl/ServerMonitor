import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "./actions/actions";
import { Checkbox, notification } from "antd";
import DataTable from "./components/Iis/DataTable";
import IisMaster from "./components/Iis/IisMaster";
import TaskActionButtons from "./components/TaskActionButtons";
import OracleToggleButton from "./components/OracleToggleButton";
import SessionsPanel from "./components/SessionsPanel";

const isDeployingColumn = [
  {
    title: "Reserved",
    key: "isReserved",
    dataIndex: "isReserved",
    render: (value, row) => (
      <OracleToggleButton id={row.id} isReserved={value} />
    ),
    width: 100
  },
  {
    title: "Deploying",
    key: "isDeploying",
    dataIndex: "isDeploying",
    render: value => <Checkbox defaultChecked={value} disabled />,
    width: 100
  }
];

const taskAction = {
  title: "Action",
  key: "x",
  dataIndex: "x",
  render: (value, row) => <TaskActionButtons {...row} />,
  width: 100
};

const Home = props => {
  const { errors, settings, tasks, disk, oracle } = useSelector(state => state);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("qwe");
    dispatch(actions.getTasksAction());
    dispatch(actions.getDiskUsageAction());
    dispatch(actions.getOracleAction());
  }, [dispatch, tasks.loaded, disk.loaded, oracle.loaded]);

  useEffect(() => {
    errors.data.forEach(item => {
      if (item.type === "Success") {
        notification.success(item);
      } else {
        notification.error(item);
      }
    });
  }, [errors]);

  return (
    <div style={{ background: "#fff", padding: 5, height: "100%" }}>
      <h1>Hardware Monitor</h1>
      {/* <Hardware /> */}
      <IisMaster settings={settings} />
      <DataTable
        {...oracle}
        title="Oracle Instances"
        extraColumns={isDeployingColumn}
      />
      <DataTable {...disk} title="Disk Status" rowKey="path" />

      <DataTable
        {...tasks}
        rowKey="name"
        title="Scheduled Tasks"
        extraColumns={[taskAction]}
      />
      <SessionsPanel />
    </div>
  );
};
Home.defaultProps = { isDisabled: true, data: [], columns: [] };

export default Home;

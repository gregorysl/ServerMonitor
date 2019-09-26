import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import * as actions from "./actions/actions";
import { Checkbox, notification } from "antd";
import PropTypes from "prop-types";
// import * as actions from "./actions/actions";
// import Hardware from "./components/Hardware";
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
    render: (value, row) => <OracleToggleButton {...row} />,
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
  const errors = useSelector(state => state.errors);
  const settings = useSelector(state => state.settings);
  const tasks = useSelector(state => state.tasks);
  console.log(tasks);

  // componentDidMount() {
  //   this.props.getHardwareUsage();
  //   this.props.getOracle();
  // }
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.getTasksAction());
  }, [dispatch, tasks.loaded]);
  useEffect(() => {
    errors.data.forEach(item => {
      if (item.type === "Success") {
        notification.success(item);
      } else {
        notification.error(item);
      }
    });
  }, [errors]);
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
      {/* {!props.oracle.isDisabled && (
        <DataTable
          {...props.oracle}
          title="Oracle Instances"
          extraColumns={isDeployingColumn}
        />
      )}
      <DataTable {...props.disk} title="Disk Status" />
       */}
      <DataTable
        {...props.tasks}
        title="Scheduled Tasks"
        extraColumns={[taskAction]}
      />
      {/* <SessionsPanel /> */}
    </div>
  );
};
Home.defaultProps = { isDisabled: true, data: [], columns: [] };
Home.propTypes = {
  getTasks: PropTypes.func.isRequired,
  getHardwareUsage: PropTypes.func.isRequired,
  getOracle: PropTypes.func.isRequired,
  disk: PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  oracle: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object),
    errors: PropTypes.arrayOf(PropTypes.string),
    columns: PropTypes.arrayOf(PropTypes.object),
    isDisabled: PropTypes.bool
  }).isRequired
};

const mapStateToProps = state => ({
  tasks: state.tasks,
  disk: state.disk,
  oracle: state.oracle,
  errors: state.errors
});

const mapDispatchToProps = dispatch => ({
  getHardwareUsage: () => {}, //dispatch(actions.getDiskUsageAction()),
  getOracle: () => {} //dispatch(actions.getOracleAction()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

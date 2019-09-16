import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Checkbox, notification } from "antd";
import PropTypes from "prop-types";
import * as actions from "./actions/actions";
import Hardware from "./components/Hardware";
import DataTable from "./components/Iis/DataTable";
import IisMaster from "./components/Iis/IisMaster";
import TaskActionButtons from "./components/TaskActionButtons";
import OracleToggleButton from "./components/OracleToggleButton";
import SessionsPanel from "./components/SessionsPanel";

const isDeployingColumn = [
  {
    Header: "Reserved",
    accessor: "isReserved",
    Cell: row => <OracleToggleButton {...row.original} />,
    width: 100
  },
  {
    Header: "Deploying",
    accessor: "isDeploying",
    Cell: row => (
      <Checkbox defaultChecked={row.original.isDeploying} disabled />
    ),
    width: 100
  }
];

const taskAction = {
  Header: "Action",
  accessor: "x",
  Cell: row => <TaskActionButtons {...row.original} />,
  width: 100
};

const Home = props => {
  const errors = useSelector(state => state.errors);
  const settings = useSelector(state => state.settings);
  // componentDidMount() {
  //   this.props.getTasks();
  //   this.props.getHardwareUsage();
  //   this.props.getOracle();
  // }
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
      {!props.oracle.isDisabled && (
        <DataTable
          {...props.oracle}
          title="Oracle Instances"
          extraColumns={isDeployingColumn}
        />
      )}
      <DataTable {...props.disk} title="Disk Status" />
      <DataTable
        {...props.tasks}
        title="Scheduled Tasks"
        extraColumns={[taskAction]}
      />
      <SessionsPanel />
    </div>
  );
};
Home.defaultProps = { isDisabled: true, data: [], columns: [] };
Home.propTypes = {
  getTasks: PropTypes.func.isRequired,
  getHardwareUsage: PropTypes.func.isRequired,
  getOracle: PropTypes.func.isRequired,
  tasks: PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
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
  getTasks: () => {}, //dispatch(actions.getTasksAction()),
  getHardwareUsage: () => {}, //dispatch(actions.getDiskUsageAction()),
  getOracle: () => {} //dispatch(actions.getOracleAction()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

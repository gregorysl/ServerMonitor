import React, { Component } from "react";
import { connect } from "react-redux";
import { Checkbox, notification } from "antd";
import PropTypes from "prop-types";
import * as actions from "./actions/actions";
import ServicesList from "./components/servicesList";
import Hardware from "./components/Hardware";
import DataTable from "./components/Iis/DataTable";
import IisSection from "./components/Iis/IisSection";
import TaskActionButtons from "./components/TaskActionButtons";
import OracleToggleButton from "./components/OracleToggleButton";
import SessionsActionButtons from "./components/SessionsActionButtons";

const checkErrors = (props, nextProps) => {
  if (props.length < nextProps.length) {
    const item = nextProps[nextProps.length - 1];
    if (item.type === "Success") {
      notification.success(item);
    } else {
      notification.error(item);
    }
  }
};
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
const sessionActions = {
  accessor: "x",
  Cell: row => <SessionsActionButtons {...row.original} />,
  width: 100
};

class Home extends Component {
  componentDidMount() {
    this.props.getTasks();
    this.props.getSessions();
    this.props.getHardwareUsage();
    this.props.getOracle();
    this.props.getLinks();
  }
  componentWillReceiveProps(nextProps) {
    checkErrors(this.props.errors, nextProps.errors);
  }

  render() {
    return (
      <div style={{ background: "#fff", padding: 5, height: "100%" }}>
        <h1>Hardware Monitor</h1>
        <Hardware />
        <ServicesList links={this.props.links} />
        <IisSection />
        {!this.props.oracle.isDisabled && (
          <DataTable
            {...this.props.oracle}
            title="Oracle Instances"
            extraColumns={isDeployingColumn}
          />
        )}
        <DataTable {...this.props.disk} title="Disk Status" />
        <DataTable
          {...this.props.tasks}
          title="Scheduled Tasks"
          extraColumns={[taskAction]}
        />
        <DataTable
          {...this.props.sessions}
          title="User Sessions"
          extraColumns={[sessionActions]}
        />
      </div>
    );
  }
}
Home.defaultProps = { isDisabled: true, data: [], columns: [] };
Home.propTypes = {
  getSessions: PropTypes.func.isRequired,
  getTasks: PropTypes.func.isRequired,
  getHardwareUsage: PropTypes.func.isRequired,
  getOracle: PropTypes.func.isRequired,
  sessions: PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  tasks: PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  disk: PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  links: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired
  }).isRequired,
  oracle: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object),
    errors: PropTypes.arrayOf(PropTypes.string),
    columns: PropTypes.arrayOf(PropTypes.object),
    isDisabled: PropTypes.bool
  }).isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired
};

const mapStateToProps = state => ({
  tasks: state.tasks,
  sessions: state.sessions,
  disk: state.disk,
  oracle: state.oracle,
  links: state.service,
  errors: state.errors
});

const mapDispatchToProps = dispatch => ({
  getTasks: () => dispatch(actions.getTasksAction()),
  getSessions: () => dispatch(actions.getSessionsAction()),
  getHardwareUsage: () => dispatch(actions.getDiskUsageAction()),
  getOracle: () => dispatch(actions.getOracleAction()),
  getLinks: () => dispatch(actions.getServicesAction())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

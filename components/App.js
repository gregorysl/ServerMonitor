import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, notification } from 'antd';
import PropTypes from 'prop-types';
import * as actions from '../actions/actions';
import ServicesList from './servicesList';
import Hardware from './Hardware';
import DataTable from './Iis/DataTable';
import AppPoolList from './Iis/AppPoolList';
import ActionsButtons from './Iis/ActionsButtons';

const checkErrors = (props, nextProps) => {
  if (props.length < nextProps.length) {
    const error = nextProps[nextProps.length - 1];
    notification.error({
      message: error.title,
      description: error.error
    });
  }
};
const isDeployingColumn =
  {
    title: 'Deploying',
    key: 'IsDeploying',
    render: x => (<Checkbox defaultChecked={x.IsDeploying} disabled />)

  };

const tasksAction =
  {
    title: 'Action',
    key: 'x',
    render: x => (<ActionsButtons {...x} name={x.key} />)
  };

const action =
    {
      title: 'Action',
      key: 'x',
      render: x => (<ActionsButtons {...x} name={x.key} />)
    };
const iisExpandedRowRenderer = x => (<AppPoolList items={x.apps} />);

class App extends Component {
  componentDidMount() {
    this.props.getTasks();
    this.props.getSessions();
    this.props.getUsage();
    this.props.getOracle();
    this.props.getIis();
  }
  componentWillReceiveProps(nextProps) {
    checkErrors(this.props.errors, nextProps.errors);
  }

  render() {
    return (
      <div>
        <Hardware />
        <DataTable
          data={this.props.sessions.data}
          columns={this.props.sessions.columns}
          message="No sessions found."
          rowKey="User"
        />
        <DataTable
          data={this.props.tasks.data}
          columns={this.props.tasks.columns}
          message="No tasks found."
          rowKey="Name"
        />
        <DataTable
          data={this.props.disk.data}
          columns={this.props.disk.columns}
          message="No directories found."
          rowKey="Path"
        />
        <DataTable
          data={this.props.oracle.data}
          columns={this.props.oracle.columns}
          message="No instancies found."
          extraColumns={[isDeployingColumn]}
          rowKey="CurrentBuildName"
        />
        <DataTable
          data={this.props.iis.data}
          columns={this.props.iis.columns}
          message="No IIS applications found."
          extraColumns={[action]}
          expandedRowRender={iisExpandedRowRenderer}
        />
        <ServicesList />
      </div>
    );
  }
}

App.propTypes = {
  getSessions: PropTypes.func.isRequired,
  getTasks: PropTypes.func.isRequired,
  getUsage: PropTypes.func.isRequired,
  getOracle: PropTypes.func.isRequired,
  getIis: PropTypes.func.isRequired,
  sessions: PropTypes.objectOf(PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
  })).isRequired,
  tasks: PropTypes.objectOf(PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
  })).isRequired,
  disk: PropTypes.objectOf(PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
  })).isRequired,
  oracle: PropTypes.objectOf(PropTypes.shape({
    data: PropTypes.array.isRequired,
    errors: PropTypes.arrayOf(PropTypes.string),
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
  })).isRequired,
  iis: PropTypes.objectOf(PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
  })).isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired
};

const mapStateToProps = state => ({
  tasks: state.tasks,
  sessions: state.sessions,
  disk: state.disk,
  oracle: state.oracle,
  iis: state.table,
  errors: state.errors
});

const mapDispatchToProps = dispatch => ({
  getTasks: () => dispatch(actions.getTasksAction()),
  getSessions: () => dispatch(actions.getSessionsAction()),
  getUsage: () => dispatch(actions.getDiskUsageAction()),
  getOracle: () => dispatch(actions.getOracleAction()),
  getIis: () => dispatch(actions.getIisAction()),
  runTask: name => dispatch(actions.runTask(name))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

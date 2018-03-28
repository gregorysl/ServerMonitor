import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, notification, Layout } from 'antd';
import PropTypes from 'prop-types';
import * as actions from '../actions/actions';
import ServicesList from './servicesList';
import Hardware from './Hardware';
import DataTable from './Iis/DataTable';
import AppPoolList from './Iis/AppPoolList';
import ActionsButtons from './Iis/ActionsButtons';
import TaskActionButtons from './TaskActionButtons';

const { Header, Content } = Layout;

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
  [{
    title: 'Reserved',
    key: 'isReserved',
    render: x => (<Checkbox defaultChecked={x.isReserved} />)

  }, {
    title: 'Deploying',
    key: 'isDeploying',
    render: x => (<Checkbox defaultChecked={x.isDeploying} disabled />)

  }];

const taskAction =
    {
      title: 'Action',
      key: 'x',
      render: x => (<TaskActionButtons {...x} />)
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
      <Layout className="layout">
        <Header>
          <div className="logo" />
        </Header>
        <Content style={{ padding: '0 50px' }} >
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }} >
            <h1>Hardware Monitor</h1>
            <Hardware />
            <h1>Component Status</h1>
            <ServicesList />
            <h1>IIS Applications</h1>
            <DataTable
              data={this.props.iis.data}
              columns={this.props.iis.columns}
              message="No IIS applications found."
              extraColumns={[action]}
              expandedRowRender={iisExpandedRowRenderer}
            />
            <h1>Disk Status</h1>
            <DataTable
              data={this.props.disk.data}
              columns={this.props.disk.columns}
              message="No directories found."
              rowKey="path"
            />
            <h1>Scheduled Tasks</h1>
            <DataTable
              data={this.props.tasks.data}
              columns={this.props.tasks.columns}
              message="No tasks found."
              extraColumns={[taskAction]}
              rowKey="name"
            />
            <h1>Oracle Instances</h1>
            <DataTable
              data={this.props.oracle.data}
              columns={this.props.oracle.columns}
              message="No instancies found."
              extraColumns={isDeployingColumn}
              rowKey="currentBuildName"
            />
            <h1>User Sessions</h1>
            <DataTable
              data={this.props.sessions.data}
              columns={this.props.sessions.columns}
              message="No sessions found."
              rowKey="user"
            />
          </div>
        </Content>
      </Layout>
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
  getIis: () => dispatch(actions.getIisAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

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
import OracleToggleButton from './OracleToggleButton';
import SessionsActionButtons from './SessionsActionButtons';

const { Header, Content } = Layout;

const checkErrors = (props, nextProps) => {
  if (props.length < nextProps.length) {
    const error = nextProps[nextProps.length - 1];
    notification.error(error);
  }
};
const isDeployingColumn =
  [{
    title: 'Reserved',
    key: 'isReserved',
    render: x => (<OracleToggleButton {...x} />)

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
const sessionActions =
      {
        key: 'x',
        render: x => (<SessionsActionButtons {...x} />)
      };

const action =
    {
      title: 'Action',
      key: 'x',
      render: x => (<ActionsButtons {...x} name={x.key} />),
      width: 300
    };

const iisColumns = [
  {
    title: 'Application', dataIndex: 'key', key: 'key', render: (key, item) => (<a targer="_blank" href={item.url}>{item.key}</a>)
  },
  {
    title: 'State', dataIndex: 'running', key: 'running', render: running => (running ? 'Started' : 'Stopped')
  }
];
const iisExpandedRowRenderer = x => (<AppPoolList items={x.apps} />);

class App extends Component {
  componentDidMount() {
    this.props.getTasks();
    this.props.getSessions();
    this.props.getHardwareUsage();
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
            <DataTable
              title="IIS Applications"
              loading={this.props.iis.loading}
              data={this.props.iis.data}
              columns={iisColumns}
              message="No IIS applications found."
              extraColumns={[action]}
              expandedRowRender={iisExpandedRowRenderer}
            />
            <DataTable
              title="Oracle Instances"
              data={this.props.oracle.data}
              columns={this.props.oracle.columns}
              message="No instancies found."
              extraColumns={isDeployingColumn}
              rowKey="currentBuildName"
            />
            <DataTable
              title="Disk Status"
              data={this.props.disk.data}
              columns={this.props.disk.columns}
              message="No directories found."
              rowKey="path"
            />
            <DataTable
              title="Scheduled Tasks"
              data={this.props.tasks.data}
              columns={this.props.tasks.columns}
              message="No tasks found."
              extraColumns={[taskAction]}
              rowKey="name"
            />
            <DataTable
              title="User Sessions"
              data={this.props.sessions.data}
              columns={this.props.sessions.columns}
              message="No sessions found."
              rowKey="user"
              extraColumns={[sessionActions]}
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
  getHardwareUsage: PropTypes.func.isRequired,
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
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    errors: PropTypes.arrayOf(PropTypes.string),
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
  })).isRequired,
  iis: PropTypes.objectOf(PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired
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
  getHardwareUsage: () => dispatch(actions.getDiskUsageAction()),
  getOracle: () => dispatch(actions.getOracleAction()),
  getIis: () => dispatch(actions.getIisAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

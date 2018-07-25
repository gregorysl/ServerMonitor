import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, notification, Layout } from 'antd';
import PropTypes from 'prop-types';
import * as actions from '../actions/actions';
import ServicesList from './servicesList';
import Hardware from './Hardware';
import DataTable from './Iis/DataTable';
import IisSection from './Iis/IisSection';
import TaskActionButtons from './TaskActionButtons';
import OracleToggleButton from './OracleToggleButton';
import SessionsActionButtons from './SessionsActionButtons';
import DataTableErrorMessage from './DataTableErrorMessage';

const { Header, Content } = Layout;

const checkErrors = (props, nextProps) => {
  if (props.length < nextProps.length) {
    const item = nextProps[nextProps.length - 1];
    if (item.type === 'Success') {
      notification.success(item);
    } else {
      notification.error(item);
    }
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

class App extends Component {
  componentDidMount() {
    this.props.getTasks();
    this.props.getSessions();
    this.props.getHardwareUsage();
    this.props.getOracle();
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
          <div style={{ background: '#fff', padding: 5, minHeight: 280 }} >
            <h1>Hardware Monitor</h1>
            <Hardware />
            <ServicesList />
            <IisSection />
            <DataTable
              {...this.props.oracle}
              title="Oracle Instances"
              message={(<DataTableErrorMessage title="No Oracle Instances found" />)}
              extraColumns={isDeployingColumn}
              rowKey="currentBuildName"
            />
            <DataTable
              {...this.props.disk}
              title="Disk Status"
              message={(<DataTableErrorMessage title="No directories found." />)}
              rowKey="path"
            />
            <DataTable
              {...this.props.tasks}
              title="Scheduled Tasks"
              message={(<DataTableErrorMessage title="No tasks found." />)}
              extraColumns={[taskAction]}
              rowKey="name"
            />
            <DataTable
              {...this.props.sessions}
              title="User Sessions"
              message={(<DataTableErrorMessage title="No sessions found." />)}
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
  oracle: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    errors: PropTypes.arrayOf(PropTypes.string),
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired
};

const mapStateToProps = state => ({
  tasks: state.tasks,
  sessions: state.sessions,
  disk: state.disk,
  oracle: state.oracle,
  errors: state.errors
});

const mapDispatchToProps = dispatch => ({
  getTasks: () => dispatch(actions.getTasksAction()),
  getSessions: () => dispatch(actions.getSessionsAction()),
  getHardwareUsage: () => dispatch(actions.getDiskUsageAction()),
  getOracle: () => dispatch(actions.getOracleAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

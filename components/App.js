import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../actions/actions';
import IisTable from './Iis/IisTable';
import ServicesList from './servicesList';
import Hardware from './Hardware';
import DataTable from './Iis/DataTable';

class App extends Component {
  componentDidMount() {
    this.props.getTasks();
    this.props.getSessions();
    this.props.getUsage();
  }

  render() {
    return (
      <div>
        <DataTable data={this.props.sessions.data} columns={this.props.sessions.columns} message="No sessions found." />
        <DataTable data={this.props.tasks.data} columns={this.props.tasks.columns} message="No tasks found." />
        <DataTable data={this.props.disk.data} columns={this.props.disk.columns} message="No directories found." />
        <Hardware />
        <IisTable />
        <ServicesList />
      </div>
    );
  }
}

App.propTypes = {
  getSessions: PropTypes.func.isRequired,
  getTasks: PropTypes.func.isRequired,
  getUsage: PropTypes.func.isRequired,
  sessions: PropTypes.objectOf(PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired
  })).isRequired,
  tasks: PropTypes.objectOf(PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired
  })).isRequired,
  disk: PropTypes.objectOf(PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf.isRequired
  })).isRequired
};

const mapStateToProps = state => ({
  tasks: state.tasks,
  sessions: state.sessions,
  disk: state.disk
});

const mapDispatchToProps = dispatch => ({
  getTasks: () => dispatch(actions.getTasksAction()),
  getSessions: () => dispatch(actions.getSessionsAction()),
  getUsage: () => dispatch(actions.getDiskUsageAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

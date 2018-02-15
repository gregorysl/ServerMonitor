import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import { getTasksAction } from '../../actions/actions';

class ScheduledTable extends Component {
  componentDidMount() {
    this.props.get();
  }

  render() {
    if (this.props.data.length === 0 && this.props.columns.length === 0) {
      return (<h1>No paths found.</h1>);
    }
    return (
      <Table
        columns={this.props.columns}
        dataSource={this.props.data}
        pagination={false}
      />
    );
  }
}

const mapStateToProps = state => ({
  data: state.tasks.data,
  columns: state.tasks.columns
});

const mapDispatchToProps = dispatch => ({
  get: () => {
    dispatch(getTasksAction());
  }
});

ScheduledTable.propTypes = {
  get: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledTable);

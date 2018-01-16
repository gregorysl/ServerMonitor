import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import { selectImageAction } from '../actions/actions';


const columns = [
  { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
  { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
  { title: 'Visits', dataIndex: 'visits', key: 'visits' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  {
    title: 'Action', dataIndex: '', key: 'x', render: () => <button href="#">Delete</button>,
  },
];


class SimpleTable extends Component {
  componentDidMount() {
    this.props.dispatch(selectImageAction(10));
  }
  render() {
    return (
      <Table columns={columns} dataSource={this.props.tableData} pagination={false} />
    );
  }
}

const mapStateToProps = state => ({
  tableData: state.table.data,
});

SimpleTable.propTypes = {
  dispatch: PropTypes.func.isRequired,
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps)(SimpleTable);

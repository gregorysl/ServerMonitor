import React, { Component } from 'react';
import { render } from "react-dom";
import { connect } from 'react-redux';
import 'react-table/react-table.css'
import { selectImageAction } from '../actions/actions'

import { Table } from 'antd';

const columns = [
  { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
  { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
  { title: 'Visits', dataIndex: 'visits', key: 'visits' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Action', dataIndex: '', key: 'x', render: () => <a href="#">Delete</a> },
];




class SimpleTable extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    this.props.dispatch(selectImageAction(10));
  }
  render() {
    return (
      <Table columns={columns} dataSource={this.props.tableData} pagination={false} />
    );
  }
}

const mapStateToProps = (state) => ({
    tableData: state.table.data
  });

export default connect(mapStateToProps)(SimpleTable);
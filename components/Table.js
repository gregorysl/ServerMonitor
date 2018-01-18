import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import { selectImageAction } from '../actions/actions';


const action = [
  {
    title: 'Action', dataIndex: '', key: 'x', render: () => <button href="#">Delete</button>,
  },
];


class SimpleTable extends Component {
  constructor(props) {
    super(props);
    this.state = { columns: [] };
  }

  componentDidMount() {
    this.props.dispatch(selectImageAction());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tableData !== this.props.tableData) {
      this.setState({ columns: [...nextProps.columns, ...action] });
    }
  }
  render() {
    return (
      <Table columns={this.state.columns} dataSource={this.props.tableData} pagination={false} />
    );
  }
}

const mapStateToProps = state => ({
  tableData: state.table.data.data,
  columns: state.table.data.columns,
});

SimpleTable.propTypes = {
  dispatch: PropTypes.func.isRequired,
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps)(SimpleTable);

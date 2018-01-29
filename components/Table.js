import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import { selectImageAction } from '../actions/actions';


const action = [
  {
    title: 'Action', dataIndex: '', key: 'x', render: () => <button href="#">Delete</button>
  }
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
    if (nextProps.data !== this.props.data) {
      this.setState({ columns: [...nextProps.columns, ...action] });
    }
  }
  render() {
    return (
      <Table columns={this.state.columns} dataSource={this.props.data} pagination={false} />
    );
  }
}

const mapStateToProps = state => ({
  data: state.table.data,
  columns: state.table.columns
});

SimpleTable.propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default connect(mapStateToProps)(SimpleTable);

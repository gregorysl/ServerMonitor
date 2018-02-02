import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import { getIisAction } from '../actions/actions';


const action = [
  {
    title: 'Action', dataIndex: '', key: 'x', render: () => <button href="#">Delete</button>
  }
];

const reducer = (accumulator, currentValue) => `${accumulator} ${currentValue.key} - ${currentValue.state}`;

class SimpleTable extends Component {
  constructor(props) {
    super(props);
    this.state = { columns: [] };
  }

  componentDidMount() {
    this.props.dispatch(getIisAction());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ columns: [...nextProps.columns, ...action] });
    }
  }
  render() {
    if (this.props.data.length === 0 && this.state.columns.length === 0) {
      return (<h1>No IIS applications found.</h1>);
    }
    return (
      <Table
        columns={this.state.columns}
        expandedRowRender={record => <p style={{ margin: 0 }}>{record.children.reduce(reducer, '')}</p>}
        dataSource={this.props.data}
        pagination={false}
      />
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

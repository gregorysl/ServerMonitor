import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import AppPoolList from './AppPoolList';
import { getIisAction } from '../../actions/actions';
import ActionsButtons from './ActionsButtons';


const action = [
  {
    title: 'Action',
    key: 'x',
    render: x => (<ActionsButtons {...x} name={x.key} />)

  }
];

class IisTable extends Component {
  constructor(props) {
    super(props);
    this.state = { columns: [] };
  }

  componentDidMount() {
    this.props.get();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      const data = nextProps.data.map(x => ({ ...x }));
      this.setState({ columns: [...nextProps.columns, ...action], data });
    }
  }
  render() {
    if (this.props.data.length === 0 && this.state.columns.length === 0) {
      return (<h1>No IIS applications found.</h1>);
    }
    return (
      <Table
        columns={this.state.columns}
        expandedRowRender={x => <AppPoolList items={x.apps} columns={this.props.columns} />}
        dataSource={this.state.data}
        pagination={false}
      />
    );
  }
}

const mapStateToProps = state => ({
  data: state.table.data,
  columns: state.table.columns
});

const mapDispatchToProps = dispatch => ({
  get: () => {
    dispatch(getIisAction());
  }
});

IisTable.propTypes = {
  get: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(IisTable);

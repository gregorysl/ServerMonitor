import React, { Component } from 'react';
import { render } from "react-dom";
import { connect } from 'react-redux';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import { selectImageAction } from '../actions/actions'
import { debuglog } from 'util';




class Table extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    this.props.dispatch(selectImageAction(666));
  }
  render() {
    return (
      <div>
        <ReactTable
          data={this.props.tableData}
          columns={[
            {
              Header: "Name",
              columns: [
                {
                  Header: "First Name",
                  accessor: "firstName"
                },
                {
                  Header: "Last Name",
                  id: "lastName",
                  accessor: d => d.lastName
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                  Header: "Age",
                  accessor: "age"
                },
                {
                  Header: "Status",
                  accessor: "status"
                }
              ]
            },
            {
              Header: 'Stats',
              columns: [
                {
                  Header: "Visits",
                  accessor: "visits"
                }
              ]
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
    tableData: state.table.data
  });

export default connect(mapStateToProps)(Table);
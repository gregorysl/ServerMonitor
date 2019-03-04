import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import * as actions from '../../actions/actions';
import AppPoolList from './AppPoolList';
import NoteControl from './NoteControl';
import ActionsButtons from './ActionsButtons';
import WhitelistButton from './WhitelistButton';

class IisSection extends Component {
  componentDidMount() {
    this.props.getIis();
  }
  render() {
    return (
      <React.Fragment>
        <h1 className="table-title">IIS Applications</h1>
        <ReactTable
          showPagination={false}
          noDataText="No IIS applications found"
          sortable={false}
          minRows={1}
          data={this.props.iis.data}
          defaultSorted={[{ id: 'key' }]}
          getTdProps={() => ({
            style: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }
          })}
          columns={[
            {
              Header: 'Name',
              accessor: 'name',
              Cell: row => (
                <a target="_blank" rel='noopener noreferrer' href={`${window.location.origin}/${row.original.name}/`}>
                  {row.original.name}
                </a>
              )
            },
            {
              Header: 'State',
              accessor: 'state',
              Cell: row => (
                <font className={`state-${row.original.running ? 'started' : 'stopped'}`}>
                  {row.value}
                </font>
              ),
              width: 100
            },
            {
              Header: 'Note',
              accessor: 'note',
              Cell: row => <NoteControl name={row.row.name} note={row.row.note} saveNote={row.saveNote} />,
              width: 400
            },
            {
              Header: 'Reserved',
              accessor: 'whitelisted',
              Cell: row => (
                <WhitelistButton
                  {...row.original}
                  click={this.props.whitelist}
                />
              ),
              width: 100
            },
            {
              Header: 'Action',
              accessor: 'x',
              Cell: row => <ActionsButtons {...row.original} />,
              width: 100
            }
          ]}
          SubComponent={row => (
            <AppPoolList
              app={row.original}
              items={row.original.apps}
              recycle={this.props.recycle}
            />
          )}
        />
      </React.Fragment>
    );
  }
}

IisSection.propTypes = {
  getIis: PropTypes.func.isRequired,
  iis: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired
  }).isRequired,
  whitelist: PropTypes.func.isRequired,
  recycle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  iis: state.table
});

const mapDispatchToProps = dispatch => ({
  getIis: () => dispatch(actions.getIisAction()),
  recycle: name => dispatch(actions.recycleApp(name)),
  whitelist: (item) => {
    dispatch(actions.whitelistApp(item.name));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IisSection);

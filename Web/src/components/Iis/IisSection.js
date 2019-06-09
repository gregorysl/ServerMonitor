import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import * as actions from '../../actions/actions';
import AppPoolList from './AppPoolList';
import NoteControl from './NoteControl';
import ActionsButtons from './ActionsButtons';
import WhitelistButton from './WhitelistButton';
import ApplicationStatus from './ApplicationStatus';

class IisSection extends Component {
  render() {
    const location = this.props.iisData.homeUrl.split("/").splice(0,3).join("/");
    return (
      <React.Fragment>
        <ReactTable
          showPagination={false}
          noDataText="No IIS applications found"
          sortable={false}
          minRows={1}
          data={this.props.iisData.data}
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
                <a target="_blank" rel='noopener noreferrer' href={`${location}/${row.original.name}/`}>
                  {row.original.name}
                </a>
              )
            },
            {
              Header: 'State',
              accessor: 'state',
              Cell: row => <ApplicationStatus running={row.value} text={row.value} />,              
              width: 100
            },
            {
              Header: 'Note',
              accessor: 'note',
              Cell: row => <NoteControl name={row.row.name} note={row.row.note} saveNote={row.saveNote} org={row.original} url={location} />,
              width: 400
            },
            {
              Header: 'Reserved',
              accessor: 'whitelisted',
              Cell: row => (
                <WhitelistButton {...row.original} click={this.props.set} org={row.original} url={location} refresh={this.props.refresh}
                />
              ),
              width: 100
            },
            {
              Header: 'Action',
              accessor: 'x',
              Cell: row => <ActionsButtons {...row.original} org={row.original} url={location} refresh={this.props.refresh} />,
              width: 100
            }
          ]}
          SubComponent={row => (
            <AppPoolList
              app={row.original}
              items={row.original.apps}
              recycle={this.props.recycle}
              url={location}
            />
          )}
        />
      </React.Fragment>
    );
  }
}

// IisSection.propTypes = {
//   iis: PropTypes.shape({
//     data: PropTypes.arrayOf(PropTypes.object).isRequired
//   }).isRequired,
//   whitelist: PropTypes.func.isRequired,
//   recycle: PropTypes.func.isRequired
// };

const mapStateToProps = state => ({
  iis: state.table
});

const mapDispatchToProps = dispatch => ({
  recycle: (name, url) => dispatch(actions.recycleApp(name, url)),
  whitelist: (item, url) => dispatch(actions.whitelistApp(item.name, url)),
  set: (item, url, refresh) => {
    const data =
    {
      build: item,
      action: "Whitelist"
    };
    dispatch(actions.setIisAction(data,url));
    refresh(true);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IisSection);

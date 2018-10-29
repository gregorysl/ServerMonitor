import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../../actions/actions';
import DataTable from './DataTable';
import AppPoolList from './AppPoolList';
import NoteControl from './NoteControl';
import ActionsButtons from './ActionsButtons';
import WhitelistButton from './WhitelistButton';
import DataTableErrorMessage from './../DataTableErrorMessage';

const flatten = list =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const iisExpandedRowRenderer = x => <AppPoolList items={x.apps} />;

class IisSection extends Component {
  componentDidMount() {
    this.props.getIis();
  }
  getColumns() {
    return [
      {
        title: 'Application',
        dataIndex: 'key',
        key: 'key',
        render: (key, item) => (
          <a target="_blank" href={item.url}>
            {item.key}
          </a>
        )
      },
      {
        title: 'State',
        dataIndex: 'running',
        key: 'running',
        render: running => (running ? 'Started' : 'Stopped'),
        width: 100
      },
      {
        title: 'Note',
        dataIndex: 'note',
        key: 'note',
        render: (a, x) => <NoteControl {...x} name={x.key} />,
        width: 400
      },
      {
        title: 'Reserved',
        key: 'whitelisted',
        align: 'center',
        render: (a, x) => (
          <WhitelistButton {...x} name={x.key} click={this.props.whitelist} />
        ),
        width: 100
      },
      {
        title: 'Action',
        key: 'x',
        render: x => <ActionsButtons {...x} name={x.key} />,
        width: 100
      }
    ];
  }
  render() {
    return (
      <DataTable
        {...this.props.iis}
        title="IIS Applications"
        columns={this.getColumns()}
        message={<DataTableErrorMessage title="No directories found." />}
        expandedRowRender={iisExpandedRowRenderer}
      />
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
  whitelist: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  iis: state.table
});

const mapDispatchToProps = dispatch => ({
  getIis: () => dispatch(actions.getIisAction()),
  whitelist: (item) => {
    const data = {
      appPools: flatten(item.apps.map(x => x.children)),
      condition: item.whitelisted
    };
    dispatch(actions.whitelistApp(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IisSection);

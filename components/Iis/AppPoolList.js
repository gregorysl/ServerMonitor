import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import PropTypes from 'prop-types';
import TooltipButon from '../TooltipButon';

const AppPoolList = (props) => {
  if (props.items.length === 0) {
    return <h1>No IIS applications found.</h1>;
  }
  return (
    <ReactTable
      showPagination={false}
      minRows={1}
      data={props.items}
      columns={[
        {
          Header: 'Name',
          accessor: 'name'
        },
        {
          Header: 'State',
          accessor: 'running',
          Cell: row => (
            <font className={`state-${row.value ? 'started' : 'stopped'}`}>
              {row.value ? 'Started' : 'Stopped'}
            </font>
          )
        },
        {
          Header: 'Action',
          accessor: 'x',
          Cell: row => <TooltipButon title="recycle" icon="reload" />,
          width: 100
        }
      ]}
      SubComponent={row => (
        <div className="app-pool-children">
          {row.original.children.map(x => (
            <span key={x}>{x}</span>
          ))}
        </div>
      )}
    />
  );
};

AppPoolList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default AppPoolList;

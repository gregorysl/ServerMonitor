import React from 'react';
import { Table, Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';


const action = [
  {
    title: 'Action', dataIndex: '', key: 'x', render: () => <Tooltip title="recycle" ><Icon type="reload" /></Tooltip>
  }
];

const AppPoolList = (props) => {
  if (props.items.length === 0) {
    return (<h1>No IIS applications found.</h1>);
  }
  const columns = [...props.columns, ...action];
  return (
    <Table
      showHeader={false}
      columns={columns}
      dataSource={props.items}
      pagination={false}
    />
  );
};

AppPoolList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default AppPoolList;

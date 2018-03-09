import React from 'react';
import { Table, Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';


const columns = [
  { title: 'key', dataIndex: 'key', key: 'key' },
  { title: 'State', dataIndex: 'State', key: 'State' },
  {
    title: 'Action', dataIndex: '', key: 'x', render: () => <Tooltip title="recycle" ><Icon type="reload" /></Tooltip>
  }
];

const AppPoolList = (props) => {
  if (props.items.length === 0) {
    return (<h1>No IIS applications found.</h1>);
  }
  props.items.forEach((element) => {
    if (element.children) {
      const childs = element.children.map(x => ({ key: x }));
      element.children = childs;
    }
  });
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
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default AppPoolList;

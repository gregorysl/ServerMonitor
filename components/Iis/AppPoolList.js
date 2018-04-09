import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import TooltipButon from '../TooltipButon';


const columns = [
  { title: 'key', dataIndex: 'key', key: 'key' },
  {
    title: 'State', dataIndex: 'running', key: 'running', render: running => (running ? 'Started' : 'Stopped')
  },
  {
    title: 'Action', dataIndex: '', key: 'x', render: () => <TooltipButon title="recycle" icon="reload" />
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

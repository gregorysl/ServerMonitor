import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';


const DataTable = ({ data, columns, message }) => {
  if (data.length === 0 && columns.length === 0) {
    return (<h1>{message}</h1>);
  }
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
};


DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  message: PropTypes.string.isRequired
};

export default DataTable;

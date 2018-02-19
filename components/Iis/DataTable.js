import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';


const DataTable = ({
  data, columns, message, extraColumns = []
}) => {
  if (data.length === 0 && columns.length === 0) {
    return (<h1>{message}</h1>);
  }
  const finalColumns = [...columns, ...extraColumns];
  return (
    <Table
      columns={finalColumns}
      dataSource={data}
      pagination={false}
    />
  );
};

DataTable.defaultProps = {
  extraColumns: []
};

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  message: PropTypes.string.isRequired,
  extraColumns: PropTypes.arrayOf(PropTypes.object)
};

export default DataTable;

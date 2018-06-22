import React from 'react';
import { Spin, Table } from 'antd';
import PropTypes from 'prop-types';


const DataTable = ({
  data,
  columns,
  message,
  loading,
  expandedRowRender,
  extraColumns = [],
  rowKey = 'key'
}) => {
  if (data.length === 0 && columns.length === 0) {
    return (<h2>{message}</h2>);
  }
  console.log(loading);
  const finalColumns = [...columns, ...extraColumns];
  return (
    <Spin spinning={loading}>
      <Table
        rowKey={rowKey}
        columns={finalColumns}
        dataSource={data}
        pagination={false}
        expandedRowRender={expandedRowRender}
      />
    </Spin>
  );
};

DataTable.defaultProps = {
  extraColumns: [],
  rowKey: 'key',
  loading: false,
  expandedRowRender: null
};

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  message: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  rowKey: PropTypes.string,
  expandedRowRender: PropTypes.func,
  extraColumns: PropTypes.arrayOf(PropTypes.object)
};

export default DataTable;

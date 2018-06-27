import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';


const DataTable = ({
  data,
  title,
  columns,
  message,
  loading,
  expandedRowRender,
  extraColumns = [],
  rowKey = 'key'
}) => {
  const finalColumns = [...columns, ...extraColumns];
  return (
    <Table
      locale={{ emptyText: message }}
      rowKey={rowKey}
      columns={finalColumns}
      dataSource={data}
      size="small"
      loading={loading}
      title={() => (<h1 className="table-title">{title}</h1>)}
      pagination={false}
      expandedRowRender={expandedRowRender}
    />
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
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  rowKey: PropTypes.string,
  expandedRowRender: PropTypes.func,
  extraColumns: PropTypes.arrayOf(PropTypes.object)
};

export default DataTable;

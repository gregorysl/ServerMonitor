import React from "react";
import { Table } from "antd";
import PropTypes from "prop-types";

const DataTable = ({ title, data, columns, extraColumns, loaded, rowKey }) => {
  const finalColumns = [...columns, ...extraColumns];
  return (
    <React.Fragment>
      <h1 className="table-title">{title}</h1>
      <Table
        loading={!loaded}
        rowKey={rowKey}
        pagination={false}
        columns={finalColumns}
        dataSource={data}
      />
    </React.Fragment>
  );
};

DataTable.defaultProps = {
  extraColumns: [],
  rowKey: "id"
};

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  extraColumns: PropTypes.arrayOf(PropTypes.object)
};

export default DataTable;

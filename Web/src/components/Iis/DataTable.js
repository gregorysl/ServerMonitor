import React from "react";
import MaterialTable from "material-table";

const DataTable = ({
  title,
  data,
  columns,
  extraColumns = [],
  loaded,
  rowKey
}) => {
  return (
    <MaterialTable
      title={title}
      columns={columns}
      data={data}
      actions={extraColumns}
      options={{
        paging: false,
        actionsColumnIndex: -1,
        search: false,
        sorting: false,
        draggable: false
      }}
    />
  );
};

DataTable.defaultProps = {
  rowKey: "id"
};

export default DataTable;

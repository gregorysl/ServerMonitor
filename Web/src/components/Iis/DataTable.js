import React from "react";
import MaterialTable from "material-table";
import Typography from "@material-ui/core/Typography";

const DataTable = ({
  title,
  data,
  columns,
  extraColumns = [],
  loaded,
  rowKey
}) => {
  return (
    <>
      <Typography variant="subtitle1">{title}</Typography>
      <MaterialTable
        columns={columns}
        data={data}
        actions={extraColumns}
        options={{
          paging: false,
          actionsColumnIndex: -1,
          search: false,
          sorting: false,
          draggable: false,
          toolbar: false
        }}
      />
    </>
  );
};

DataTable.defaultProps = {
  rowKey: "id"
};

export default DataTable;

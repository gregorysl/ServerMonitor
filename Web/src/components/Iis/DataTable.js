import React from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';

const DataTable = ({
  data,
  title,
  columns,
  loading,
  extraColumns,
  message
}) => {
  const finalColumns = [...columns, ...extraColumns];
  return (data.length !== 0 ) && (
    <React.Fragment>
      <h1 className="table-title">{title}</h1>
      {message !== '' && <h2>{message}</h2>}
      <ReactTable
        showPagination={false}
        sortable={false}
        loading={loading}
        data={data}
        columns={finalColumns}
        minRows={1}
      />
    </React.Fragment>
  );
};

DataTable.defaultProps = {
  extraColumns: [],
  loading: false,
  message: ''
};

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  loading: PropTypes.bool,
  extraColumns: PropTypes.arrayOf(PropTypes.object)
};

export default DataTable;

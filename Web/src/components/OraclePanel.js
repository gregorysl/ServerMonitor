import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOracleAction, setOracle } from "../actions/actions";
import DataTable from "./Iis/DataTable";
import Checkbox from "@material-ui/core/Checkbox";

const OraclePanel = props => {
  const dispatch = useDispatch();
  const { oracle, settings } = useSelector(state => state);
  useEffect(() => {
    if (!oracle.loaded && !oracle.loading) {
      dispatch(getOracleAction());
    }
  }, [dispatch, oracle.loaded, oracle.loading]);
  const actionColumns = [
    {
      title: "Reserved",
      width: 50,
      render: rowData => (
        <Checkbox
          onClick={() =>
            dispatch(
              setOracle({ id: rowData.id, Reserve: !rowData.isReserved })
            )
          }
          color="primary"
          checked={rowData.isReserved}
        />
      )
    },
    {
      title: "Deploying",
      width: 50,
      render: rowData => (
        <Checkbox color="primary" checked={rowData.isDeploying} disabled />
      )
    }
  ];
  if (!settings.isOracleInstanceManagerEnabled) return null;
  const finalColumns = [...oracle.columns, ...actionColumns];

  return (
    <DataTable {...oracle} columns={finalColumns} title="Oracle Instances" />
  );
};

export default OraclePanel;

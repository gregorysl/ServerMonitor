import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOracleAction, setOracle } from "../actions/actions";
import DataTable from "./Iis/DataTable";
import Checkbox from "@material-ui/core/Checkbox";

const OraclePanel = props => {
  const dispatch = useDispatch();
  const oracle = useSelector(state => state.oracle);
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
          defaultChecked={rowData.isReserved}
        />
      )
    },
    {
      title: "Deploying",
      width: 50,
      render: rowData => (
        <Checkbox
          color="primary"
          defaultChecked={rowData.isDeploying}
          disabled
        />
      )
    }
  ];
  const finalColumns = [...oracle.columns, ...actionColumns];
  if (!oracle.loaded && !oracle.loading) {
    dispatch(getOracleAction());
  }
  return oracle.data ? (
    <DataTable {...oracle} columns={finalColumns} title="Oracle Instances" />
  ) : null;
};

export default OraclePanel;

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOracleAction, setOracle } from "../actions/actions";
import DataTable from "./Iis/DataTable";
import Checkbox from "@material-ui/core/Checkbox";

const OraclePanel = props => {
  const dispatch = useDispatch();
  const oracle = useSelector(state => state.oracle);
  const actions = [
    rowData => ({
      icon: () => <Checkbox defaultChecked={rowData.isReserved} />,
      onClick: (event, row) =>
        dispatch(setOracle({ id: row.id, Reserve: !row.isReserved }))
    }),
    rowData => ({
      icon: () => <Checkbox defaultChecked={rowData.isDeploying} disabled />,
      tooltip: "Deploying"
    })
  ];

  if (!oracle.loaded && !oracle.loading) {
    dispatch(getOracleAction());
  }
  return oracle.data ? (
    <DataTable {...oracle} title="Oracle Instances" extraColumns={actions} />
  ) : null;
};

export default OraclePanel;

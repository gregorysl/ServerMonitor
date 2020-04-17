import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasksAction, setOracle } from "../actions/actions";
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

  if (!oracle.loaded) {
    dispatch(getTasksAction());
  }
  return (
    <DataTable {...oracle} title="Oracle Instances" extraColumns={actions} />
  );
};

export default OraclePanel;

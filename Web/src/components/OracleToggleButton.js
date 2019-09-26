import React from "react";
import { useDispatch } from "react-redux";
import { Checkbox } from "antd";
import { setOracle } from "../actions/actions";

const OracleToggleButton = ({ id, isReserved }) => {
  const dispatch = useDispatch();
  const onClick = () => dispatch(setOracle({ id, Reserve: !isReserved }));
  return <Checkbox defaultChecked={isReserved} onClick={onClick} />;
};

export default OracleToggleButton;

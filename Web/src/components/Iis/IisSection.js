import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../actions/actions";
import { Row } from "antd";
import AppCard from "./AppCard";

const IisSection = props => {
  const iisData = useSelector(state => {
    const key = state.table.keys.indexOf(props.url);
    if (key === -1) return [];
    else return state.table.data[key];
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.getIisAction(props.url));
  }, [dispatch, props.url]);
  const click = data => dispatch(actions.setIisAction(data, props.url));
  const location = props.url
    .split("/")
    .splice(0, 3)
    .join("/");
  const displayData = iisData.map(x => (
    <AppCard x={x} click={click} location={location} url={props.url} />
  ));
  return <Row>{displayData}</Row>;
};

export default IisSection;

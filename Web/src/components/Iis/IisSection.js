import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTable, useExpanded } from "react-table";
import * as actions from "../../actions/actions";
import { Row, Col, Card, Icon, Tooltip, Button } from "antd";
import AppPoolList from "./AppPoolList";
import NoteControl from "./NoteControl";
import ApplicationStatus from "./ApplicationStatus";
import ActionPanel from "./ActionPanel";
import Isq from "./AppCard";
import AppName from "./AppName";

const IisSection = props => {
  const iisData = useSelector(state => {
    const key = state.table.keys.indexOf(props.url);
    if (key === -1) return [];
    else return state.table.data[key];
  });
  const dispatch = useDispatch();
  const click = data => dispatch(actions.setIisAction(data, props.url));
  useEffect(() => {
    dispatch(actions.getIisAction(props.url));
  }, [dispatch, props.url]);
  const location = props.url
    .split("/")
    .splice(0, 3)
    .join("/");
  const displayData = iisData.map(x => {
    return <Isq x={x} click={click} location={location} url={props.url} />;
  });
  return <Row>{displayData}</Row>;
};

export default IisSection;

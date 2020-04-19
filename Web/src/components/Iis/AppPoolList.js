import React from "react";
import { useDispatch } from "react-redux";
import dateformat from "dateformat";
import {
  ReloadOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import TooltipIcon from "../TooltipIcon";
import ApplicationStatus from "./ApplicationStatus";
import * as actions from "../../actions/actions";
import { Row, Col, Tooltip } from "antd";
import { WarningFilled } from "@ant-design/icons";

const AppPoolList = props => {
  const dispatch = useDispatch();
  const toggle = data => dispatch(actions.setIisAction(data, props.url));
  const recycle = value => dispatch(actions.recycleApp(value, props.url));
  if (props.items.length === 0) {
    return <h1>No IIS applications found.</h1>;
  }
  const data = props.items.map(x => (
    <Row key={x.name}>
      <Col span={15}>
        {x.name && x.pool && x.name !== x.pool && (
          <Tooltip title="Application pool has different name than IIS application. Check your configuration for errors">
            <WarningFilled className="icon-large" />
          </Tooltip>
        )}
        <span>{x.name}</span>
      </Col>
      <Col span={5}>
        <ApplicationStatus state={x.running ? "Running" : "Stopped"} {...x} />
      </Col>
      <Col span={4}>
        <TooltipIcon
          tooltip={x.running ? "Stop" : "Start"}
          type="default"
          click={() =>
            toggle({
              build: { apps: [x] },
              action: "Toggle"
            })
          }
          icon={x.running ? <CloseCircleOutlined /> : <PlayCircleOutlined />}
        />
        {x.running && (
          <TooltipIcon
            type="default"
            tooltip="recycle"
            icon={<ReloadOutlined />}
            click={() => {
              recycle(x.name);
            }}
          />
        )}
      </Col>
    </Row>
  ));
  return (
    <Row>
      {props.org.daysOld} days old, created
      {dateformat(props.org.createdDateTime, " dd.mm.yyyy, dddd")}
      {data}
    </Row>
  );
};

export default AppPoolList;

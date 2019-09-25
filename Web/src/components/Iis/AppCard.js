import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTable, useExpanded } from "react-table";
import * as actions from "../../actions/actions";
import { Row, Col, Card, Icon, Tooltip, Button } from "antd";
// import ReactTable from "react-table";
import AppPoolList from "./AppPoolList";
import NoteControl from "./NoteControl";
import ApplicationStatus from "./ApplicationStatus";
import ActionPanel from "./ActionPanel";
import StartStopButton from "./StartStopButton";
import WhitelistButton from "./WhitelistButton";
import AppName from "./AppName";
import WarningIcon from "../WarningIcon";

const { Meta } = Card;
// const

const AppCard = ({ x, click, location, url }) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  return (
    <Col className="gutter-row" span={6} key={x.name}>
      <Card
        className={x.running ? "" : "stopped"}
        style={{ margin: "0 5px 5px 0" }}
        actions={[
          <StartStopButton build={x} click={click} running={x.running} />,
          <WhitelistButton
            build={x}
            click={click}
            whitelisted={x.whitelisted}
          />,
          <Button
            icon="edit"
            size="small"
            theme={editing ? "twoTone" : "outlined"}
            onClick={() => setEditing(!editing)}
            type={editing ? "primary" : "default"}
          >
            Edit
          </Button>,
          <Button
            size="small"
            icon="unordered-list"
            type={expanded ? "primary" : "default"}
            onClick={() => setExpanded(!expanded)}
          >
            Details
          </Button>
        ]}
      >
        <Meta
          title={
            <>
              <Row>
                <WarningIcon
                  show={x.cleanerMark}
                  text="This build matches criteria to be cleaned on next run"
                />
                <AppName
                  location={location}
                  name={x.name}
                  org={x}
                  running={x.running}
                />
                <ApplicationStatus
                  state={x.state}
                  cleanerMark={x.cleanerMark}
                />
              </Row>
              <NoteControl org={x} url={url} editing={editing} />
            </>
          }
          description={
            expanded && <AppPoolList org={x} url={url} items={x.apps} />
          }
        />
      </Card>
    </Col>
  );
};
export default AppCard;

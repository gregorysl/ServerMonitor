import React, { useState } from "react";
import { Row, Col, Card, Button } from "antd";
import AppPoolList from "./AppPoolList";
import NoteControl from "./NoteControl";
import ApplicationStatus from "./ApplicationStatus";
import StartStopButton from "./StartStopButton";
import WhitelistButton from "./WhitelistButton";
import AppName from "./AppName";
import WarningIcon from "../WarningIcon";

const { Meta } = Card;
const ActionToggleButton = ({ isClicked, click, text, icon }) => (
  <Button
    icon={icon}
    size="small"
    type={isClicked ? "primary" : "default"}
    onClick={click}
  >
    {text}
  </Button>
);

const AppCard = ({ x, click, location, url }) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  return (
    <Col span={6} key={x.name}>
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
          <ActionToggleButton
            click={() => setEditing(!editing)}
            isClicked={editing}
            text="Edit"
            icon="edit"
          />,
          <ActionToggleButton
            click={() => setExpanded(!expanded)}
            isClicked={expanded}
            text="Details"
            icon="unordered-list"
          />
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

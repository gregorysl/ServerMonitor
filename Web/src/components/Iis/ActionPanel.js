import React from "react";
import StartStopButton from "./StartStopButton";
import WhitelistButton from "./WhitelistButton";

const ActionPanel = props => {
  return (
    <div style={{ display: "block" }}>
      <StartStopButton
        click={props.click}
        org={props.org}
        url={props.url}
        refresh={props.refresh}
        running={props.running}
      />
      <WhitelistButton
        click={props.click}
        org={props.org}
        url={props.url}
        refresh={props.refresh}
        whitelisted={props.whitelisted}
      />
    </div>
  );
};

export default ActionPanel;

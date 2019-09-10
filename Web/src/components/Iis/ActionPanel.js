import React from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../actions/actions";
import StartStopButton from "./StartStopButton";
import WhitelistButton from "./WhitelistButton";

const ActionPanel = props => {
  const dispatch = useDispatch();

  const click = data => dispatch(actions.setIisAction(data, props.url));
  return (
    <div style={{ display: "block" }}>
      <StartStopButton
        build={props.org}
        click={click}
        running={props.running}
      />
      <WhitelistButton
        build={props.org}
        click={click}
        whitelisted={props.whitelisted}
      />
    </div>
  );
};

export default ActionPanel;

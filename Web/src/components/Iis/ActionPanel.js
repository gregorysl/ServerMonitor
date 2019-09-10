import React from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../actions/actions";
import StartStopButton from "./StartStopButton";
import WhitelistButton from "./WhitelistButton";

const ActionPanel = props => {
  const dispatch = useDispatch();

  const click = action =>
    dispatch(
      actions.setIisAction(
        {
          build: props.org,
          action
        },
        props.url
      )
    );
  return (
    <div style={{ display: "block" }}>
      <StartStopButton click={click} running={props.running} />
      <WhitelistButton click={click} whitelisted={props.whitelisted} />
    </div>
  );
};

export default ActionPanel;

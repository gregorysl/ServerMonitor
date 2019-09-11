import React from "react";
import TooltipButton from "./TooltipButton";

const SessionsActionButtons = props => {
  return (
    props.state !== "Active" && (
      <TooltipButton
        click={props.click}
        icon="user-delete"
        tooltip="Log off user"
      />
    )
  );
};

export default SessionsActionButtons;

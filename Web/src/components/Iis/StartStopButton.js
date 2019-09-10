import React from "react";
import PropTypes from "prop-types";
import TooltipButton from "../TooltipButton";

const StartStopButton = ({ running, click, build }) => {
  const tooltip = running ? "Stop" : "Start";
  const icon = running ? "close-circle" : "play-circle";
  const toggle = () =>
    click({
      build,
      action: "Toggle"
    });
  return <TooltipButton tooltip={tooltip} click={toggle} icon={icon} />;
};

StartStopButton.propTypes = {
  running: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default StartStopButton;

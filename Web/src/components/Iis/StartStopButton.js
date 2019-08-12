import React from "react";
import PropTypes from "prop-types";
import TooltipButton from "../TooltipButton";

const StartStopButton = props => {
  const tooltip = props.running ? "Stop" : "Start";
  const icon = props.running ? "close-square-o" : "play-square-o";
  const click = () => props.click(props.org, props.url, props.refresh, "Toggle");
  return <TooltipButton tooltip={tooltip} click={click} icon={icon} />;
};

StartStopButton.propTypes = {
  running: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default StartStopButton;

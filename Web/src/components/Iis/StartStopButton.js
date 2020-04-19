import React from "react";
import PropTypes from "prop-types";
import TooltipIcon from "../TooltipIcon";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";

const StartStopButton = ({ running, click, build }) => {
  const tooltip = running ? "Stop" : "Start";
  const icon = running ? <PauseIcon /> : <PlayArrowIcon />;
  const toggle = () =>
    click({
      build,
      action: "Toggle"
    });
  return <TooltipIcon tooltip={tooltip} click={toggle} icon={icon} />;
};

StartStopButton.propTypes = {
  running: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default StartStopButton;

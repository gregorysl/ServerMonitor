import React from "react";
import PropTypes from "prop-types";
import { Switch } from "antd";

const StartStopButton = ({ running, click, build }) => {
  const toggle = () =>
    click({
      build,
      action: "Toggle"
    });
  return <Switch checked={running} onChange={toggle} />;
};

StartStopButton.propTypes = {
  running: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default StartStopButton;

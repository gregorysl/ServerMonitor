import React from "react";
import PropTypes from "prop-types";
import { LockOutlined } from "@ant-design/icons";
import TooltipButton from "../TooltipButton";

const WhitelistButton = ({ whitelisted, click, build }) => {
  const tooltip = whitelisted ? "Unlock" : "Lock";
  const styles = whitelisted ? "locked" : "unlocked";
  const whitelist = () =>
    click({
      build,
      action: "Whitelist"
    });
  return (
    <TooltipButton
      tooltip={tooltip}
      type="default"
      text={tooltip}
      click={whitelist}
      icon={<LockOutlined />}
      styles={styles}
    />
  );
};

WhitelistButton.propTypes = {
  whitelisted: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default WhitelistButton;

import React from "react";
import PropTypes from "prop-types";
import TooltipButton from "../TooltipButton";

const WhitelistButton = ({ whitelisted, click, build }) => {
  const tooltip = whitelisted ? "Remove from whitelist" : "Whitelist";
  const theme = whitelisted ? "filled" : "outlined";
  const whitelist = () =>
    click({
      build,
      action: "Whitelist"
    });
  return (
    <TooltipButton
      tooltip={tooltip}
      click={whitelist}
      icon="lock"
      theme={theme}
    />
  );
};

WhitelistButton.propTypes = {
  whitelisted: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default WhitelistButton;

import React from "react";
import PropTypes from "prop-types";
import TooltipButton from "../TooltipButton";

const WhitelistButton = props => {
  const tooltip = props.whitelisted ? "Remove from whitelist" : "Whitelist";
  const theme = props.whitelisted ? "filled" : "outlined";
  const click = () => props.click("Whitelist");
  return (
    <TooltipButton tooltip={tooltip} click={click} icon="lock" theme={theme} />
  );
};

WhitelistButton.propTypes = {
  whitelisted: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default WhitelistButton;

import React from "react";
import PropTypes from "prop-types";
import TooltipIcon from "../TooltipIcon";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";

const WhitelistButton = ({ whitelisted, click, build }) => {
  const tooltip = whitelisted ? "Unlock" : "Lock";
  const icon = whitelisted ? <StarIcon /> : <StarBorderIcon />;
  const whitelist = () =>
    click({
      build,
      action: "Whitelist"
    });
  return <TooltipIcon tooltip={tooltip} click={whitelist} icon={icon} />;
};

WhitelistButton.propTypes = {
  whitelisted: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default WhitelistButton;

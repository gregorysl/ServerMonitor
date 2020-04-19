import React from "react";
import PropTypes from "prop-types";
import TooltipIcon from "../TooltipIcon";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

const WhitelistButton = ({ whitelisted, click, build }) => {
  const tooltip = whitelisted ? "Unlock" : "Lock";
  const icon = whitelisted ? <FavoriteIcon /> : <FavoriteBorderIcon />;
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

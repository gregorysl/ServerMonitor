import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

const TooltipIcon = ({ tooltip, click, icon }) => (
  <Tooltip title={tooltip}>
    <IconButton aria-label={tooltip} onClick={click}>
      {icon}
    </IconButton>
  </Tooltip>
);

export default TooltipIcon;

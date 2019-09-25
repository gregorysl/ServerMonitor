import React from "react";
import { Button, Tooltip } from "antd";
import PropTypes from "prop-types";

const TooltipButton = props => (
  <Tooltip title={props.tooltip}>
    <Button
      className={props.styles}
      size="small"
      type={props.type}
      onClick={props.click}
      icon={props.icon}
    >
      {props.text}
    </Button>
  </Tooltip>
);

TooltipButton.defaultProps = {
  click: null,
  type: "primary"
};

TooltipButton.propTypes = {
  icon: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  click: PropTypes.func
};

export default TooltipButton;

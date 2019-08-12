import React from "react";
import { Icon, Tooltip } from "antd";
import PropTypes from "prop-types";

const TooltipButton = props => (
  <Tooltip title={props.tooltip}>
    <Icon
      className='icon-hand'
      onClick={props.click}
      type={props.icon}
      theme={props.theme}
    />
  </Tooltip>
);

TooltipButton.defaultProps = {
  click: null,
  theme: "outlined"
};

TooltipButton.propTypes = {
  icon: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  theme: PropTypes.string,
  click: PropTypes.func
};

export default TooltipButton;

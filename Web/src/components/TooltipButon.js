import React from 'react';
import { Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';


const TooltipButon = props => (
  <Tooltip title={props.title} >
    <Icon className="icon-hand" onClick={props.click} type={props.icon} />
  </Tooltip>
);

TooltipButon.defaultProps = {
  click: null
};

TooltipButon.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  click: PropTypes.func
};

export default TooltipButon;

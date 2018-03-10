import React from 'react';
import { Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';


const WhitelistButton = (props) => {
  const title = props.running ? 'stop' : 'start';
  const icon = props.running ? 'star-o' : 'star';
  return (
    <Tooltip title={title} >
      <Icon onClick={props.click} type={icon} />
    </Tooltip>
  );
};

WhitelistButton.propTypes = {
  running: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default WhitelistButton;

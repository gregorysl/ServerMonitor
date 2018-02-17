import React from 'react';
import { Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';


const WhitelistButton = (props) => {
  const title = props.state === 'Whitelisted' ? 'stop' : 'start';
  const icon = props.state === 'Started' ? 'star-o' : 'star';
  return (
    <Tooltip title={title} >
      <Icon onClick={props.click} type={icon} />
    </Tooltip>
  );
};

WhitelistButton.propTypes = {
  state: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired
};

export default WhitelistButton;

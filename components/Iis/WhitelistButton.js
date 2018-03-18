import React from 'react';
import { Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';


const WhitelistButton = (props) => {
  const title = props.whitelisted ? 'Remove from whitelist' : 'Whitelist';
  const icon = props.whitelisted ? 'star' : 'star-o';
  return (
    <Tooltip title={title} >
      <Icon onClick={props.click} type={icon} />
    </Tooltip>
  );
};

WhitelistButton.propTypes = {
  whitelisted: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default WhitelistButton;

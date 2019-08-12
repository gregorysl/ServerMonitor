import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from 'antd';


const WhitelistButton = (props) => {
  const title = props.whitelisted ? 'Remove from whitelist' : 'Whitelist';
  const click = () => props.click(props.org, props.url, props.refresh, "Whitelist");
  return (
    <Tooltip title={title} >
      <Icon className="icon-hand" onClick={click} type="save" theme={props.whitelisted ? "filled" : "outlined"}  />
    </Tooltip>
  );
};

WhitelistButton.propTypes = {
  whitelisted: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default WhitelistButton;

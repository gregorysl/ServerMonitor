import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Checkbox } from 'antd';


const WhitelistButton = (props) => {
  const title = props.whitelisted ? 'Remove from whitelist' : 'Whitelist';
  const click = () => props.click(props);
  return (
    <Tooltip title={title} >
      <Checkbox className="icon-hand" onClick={click} checked={props.whitelisted} />
    </Tooltip>
  );
};

WhitelistButton.propTypes = {
  whitelisted: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default WhitelistButton;

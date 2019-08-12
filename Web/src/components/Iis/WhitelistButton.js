import React from 'react';
import PropTypes from 'prop-types';
import TooltipButton from '../TooltipButton';


const WhitelistButton = (props) => {
  const tooltip = props.whitelisted ? 'Remove from whitelist' : 'Whitelist';
  const click = () => props.click(props.org, props.url, props.refresh, "Whitelist");
  return (
    <TooltipButton tooltip={tooltip} click={click} icon="save" theme={props.whitelisted ? "filled" : "outlined"}  />
  );
};

WhitelistButton.propTypes = {
  whitelisted: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default WhitelistButton;

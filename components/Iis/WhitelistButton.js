import React from 'react';
import PropTypes from 'prop-types';
import TooltipButon from '../TooltipButon';


const WhitelistButton = (props) => {
  const title = props.whitelisted ? 'Remove from whitelist' : 'Whitelist';
  const icon = props.whitelisted ? 'star' : 'star-o';
  return (
    <TooltipButon title={title} click={props.click} icon={icon} />
  );
};

WhitelistButton.propTypes = {
  whitelisted: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default WhitelistButton;

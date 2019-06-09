import React from 'react';
import PropTypes from 'prop-types';
import TooltipButon from '../TooltipButon';


const StartStopButton = (props) => {
  const title = props.running ? 'stop' : 'start';
  const icon = props.running ? 'pause-circle-o' : 'play-circle-o';
  const click = () => props.click(props.org, props.url, props.refresh, "Toggle");
  return (
    <TooltipButon title={title} click={click} icon={icon} />
  );
};

StartStopButton.propTypes = {
  running: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default StartStopButton;

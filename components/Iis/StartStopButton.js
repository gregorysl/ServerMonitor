import React from 'react';
import { Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';


const StartStopButton = (props) => {
  const title = props.running ? 'stop' : 'start';
  const icon = props.running ? 'pause-circle-o' : 'play-circle-o';
  return (
    <Tooltip title={title} ><Icon onClick={props.click} type={icon} /></Tooltip>
  );
};

StartStopButton.propTypes = {
  running: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default StartStopButton;

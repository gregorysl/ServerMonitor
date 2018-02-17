import React from 'react';
import { Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';


const StartStopButton = (props) => {
  const title = props.state === 'Started' ? 'stop' : 'start';
  const icon = props.state === 'Started' ? 'pause-circle-o' : 'play-circle-o';
  return (
    <Tooltip title={title} ><Icon onClick={props.click} type={icon} /></Tooltip>
  );
};

StartStopButton.propTypes = {
  state: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired
};

export default StartStopButton;

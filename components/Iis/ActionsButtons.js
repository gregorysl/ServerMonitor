import React from 'react';
import { Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import StartStopButton from './StartStopButton';

const ActionsButtons = (props) => {
  const onClick = () => props.click(props.name);
  return (
    <div>
      <StartStopButton state={props.state} click={onClick} />
      <Tooltip title="whitelist" ><Icon type="star-o" /></Tooltip>
      <Tooltip title="notes" ><Icon type="edit" /></Tooltip>
    </div>);
};

ActionsButtons.propTypes = {
  state: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired
};

export default ActionsButtons;

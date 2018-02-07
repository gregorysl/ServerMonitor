import React from 'react';
import { Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import StartStopButton from './StartStopButton';

const ButtonFn = function () {
  alert('works');
};

const ActionsButtons = props => (
  <div>
    <StartStopButton state={props.state} click={ButtonFn} />
    <Tooltip title="whitelist" ><Icon type="star-o" /></Tooltip>
    <Tooltip title="notes" ><Icon type="edit" /></Tooltip>
  </div>
);

ActionsButtons.propTypes = {
  state: PropTypes.string.isRequired
};

export default ActionsButtons;

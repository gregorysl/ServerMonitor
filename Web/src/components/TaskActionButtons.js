import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { runTask } from '../actions/actions';
import TooltipButton from './TooltipButton';

const TaskActionButtons = (props) => {
  const onClick = () => props.set(props.name);
  const icon = props.state === 'Ready' ? 'caret-right' : 'close-square';
  return (<TooltipButton click={onClick} icon={icon} tooltip="Run Task" />);
};

const mapDispatchToProps = dispatch => ({
  set: item => dispatch(runTask(item))
});

TaskActionButtons.propTypes = {
  set: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default connect(null, mapDispatchToProps)(TaskActionButtons);

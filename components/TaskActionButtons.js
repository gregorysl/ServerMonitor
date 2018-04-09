import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { runTask } from '../actions/actions';
import TooltipButon from './TooltipButon';

const TaskActionButtons = (props) => {
  const onClick = () => props.set(props.name);
  const icon = props.state === 'Ready' ? 'caret-right' : 'close-square';
  return (
    <div>
      <TooltipButon click={onClick} icon={icon} title="Run Task" />
    </div >);
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

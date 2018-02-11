import React from 'react';
import { connect } from 'react-redux';
import { Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import StartStopButton from './StartStopButton';
import { setIisAction } from '../../actions/actions';

const ActionsButtons = (props) => {
  const onClick = () => props.set(props.name);
  return (
    <div>
      <StartStopButton state={props.state} click={onClick} />
      <Tooltip title="whitelist" ><Icon type="star-o" /></Tooltip>
      <Tooltip title="notes" ><Icon type="edit" /></Tooltip>
    </div>);
};

const mapDispatchToProps = dispatch => ({
  set: (name) => {
    dispatch(setIisAction(name));
  }
});
ActionsButtons.propTypes = {
  state: PropTypes.string.isRequired,
  set: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
};

export default connect(null, mapDispatchToProps)(ActionsButtons);

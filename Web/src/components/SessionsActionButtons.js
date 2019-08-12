import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { killSession } from '../actions/actions';
import TooltipButton from './TooltipButton';

const SessionsActionButtons = (props) => {
  const onClick = () => props.set(props.id);
  return props.state !== 'Active' && (<TooltipButton click={onClick} icon="user-delete" tooltip="Log off user" />);
};

const mapDispatchToProps = dispatch => ({
  set: user => dispatch(killSession(user))
});

SessionsActionButtons.propTypes = {
  set: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
};

export default connect(null, mapDispatchToProps)(SessionsActionButtons);

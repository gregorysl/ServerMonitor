import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { killSession } from '../actions/actions';
import TooltipButon from './TooltipButon';

const SessionsActionButtons = (props) => {
  const onClick = () => props.set(props.user);
  return (<TooltipButon click={onClick} icon="usergroup-delete" title="Log off user" />);
};

const mapDispatchToProps = dispatch => ({
  set: user => dispatch(killSession(user))
});

SessionsActionButtons.propTypes = {
  set: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired
};

export default connect(null, mapDispatchToProps)(SessionsActionButtons);

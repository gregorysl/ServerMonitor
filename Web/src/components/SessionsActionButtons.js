import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { killSession } from '../actions/actions';
import TooltipButon from './TooltipButon';

const SessionsActionButtons = (props) => {
  const onClick = () => props.set(props.id);
  return props.state !== 'Active' && (<TooltipButon click={onClick} icon="user-delete" title="Log off user" />);
};

const mapDispatchToProps = dispatch => ({
  set: user => dispatch(killSession(user))
});

SessionsActionButtons.propTypes = {
  set: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
};

export default connect(null, mapDispatchToProps)(SessionsActionButtons);

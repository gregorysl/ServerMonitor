import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StartStopButton from './StartStopButton';
import { setIisAction } from '../../actions/actions';

const ActionsButtons = (props) => {
  const onSet = () => props.set(props.org, props.url, props.refresh);
  return (
      <StartStopButton running={props.running} click={onSet} />
  );
};

const mapDispatchToProps = dispatch => ({
  set: (item, url, refresh) => {
    const data =
    {
      build: item,
      action: "Toggle"
    };
    dispatch(setIisAction(data,url));
    refresh(true);
  }
});

ActionsButtons.propTypes = {
  running: PropTypes.bool.isRequired,
  set: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(ActionsButtons);

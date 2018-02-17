import React from 'react';
import { connect } from 'react-redux';
import { Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import StartStopButton from './StartStopButton';
import { setIisAction } from '../../actions/actions';
import WhitelistButton from './WhitelistButton';

const ActionsButtons = (props) => {
  const onClick = () => props.set(props.name);
  return (
    <div className="actions" >
      <StartStopButton state={props.state} click={onClick} />
      <WhitelistButton state={props.state} click={onClick} />
      <Tooltip title="notes" ><Icon type="tag" /></Tooltip>
    </div >);
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

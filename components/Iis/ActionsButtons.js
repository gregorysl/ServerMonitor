import React from 'react';
import { connect } from 'react-redux';
import { Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import StartStopButton from './StartStopButton';
import { setIisAction } from '../../actions/actions';
import WhitelistButton from './WhitelistButton';

const ActionsButtons = (props) => {
  const onClick = () => props.set(props);
  return (
    <div className="actions" >
      <StartStopButton state={props.state} click={onClick} />
      <WhitelistButton state={props.state} click={onClick} />
      <Tooltip title="notes" ><Icon type="tag" /></Tooltip>
    </div >);
};

const mapDispatchToProps = dispatch => ({
  set: (name) => {
    const apppools = Object.assign(...name.apps.map(x => x.children));
    debugger;
    dispatch(setIisAction(apppools));
  }
});
ActionsButtons.propTypes = {
  state: PropTypes.string.isRequired,
  set: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(ActionsButtons);

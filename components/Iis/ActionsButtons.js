import React from 'react';
import { connect } from 'react-redux';
import { Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import StartStopButton from './StartStopButton';
import { setIisAction } from '../../actions/actions';
import WhitelistButton from './WhitelistButton';

const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const ActionsButtons = (props) => {
  const onClick = () => props.set(props);
  return (
    <div className="actions" >
      <StartStopButton running={props.running} click={onClick} />
      <WhitelistButton running={props.running} click={onClick} />
      <Tooltip title="notes" ><Icon type="tag" /></Tooltip>
    </div >);
};

const mapDispatchToProps = dispatch => ({
  set: (item) => {
    const data =
    {
      appPools: flatten(item.apps.map(x => x.children)),
      running: item.running
    };
    dispatch(setIisAction(data));
  }
});

ActionsButtons.propTypes = {
  running: PropTypes.bool.isRequired,
  set: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(ActionsButtons);

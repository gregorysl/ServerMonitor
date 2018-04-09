import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StartStopButton from './StartStopButton';
import { setIisAction, whitelistApp } from '../../actions/actions';
import WhitelistButton from './WhitelistButton';
import TooltipButon from '../TooltipButon';

const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const ActionsButtons = (props) => {
  const onSet = () => props.set(props);
  const onWhitelist = () => props.whitelist(props);
  return (
    <React.Fragment>
      <StartStopButton running={props.running} click={onSet} />
      <WhitelistButton whitelisted={props.whitelisted} click={onWhitelist} />
      <TooltipButon title="notes" icon="tag" />
    </React.Fragment>);
};

const mapDispatchToProps = dispatch => ({
  set: (item) => {
    const data =
    {
      appPools: flatten(item.apps.map(x => x.children)),
      running: item.running
    };
    dispatch(setIisAction(data));
  },
  whitelist: (item) => {
    const data =
    {
      pools: flatten(item.apps.map(x => x.children)),
      isWhitelisted: item.whitelisted
    };
    dispatch(whitelistApp(data));
  }
});

ActionsButtons.propTypes = {
  running: PropTypes.bool.isRequired,
  whitelisted: PropTypes.bool.isRequired,
  set: PropTypes.func.isRequired,
  whitelist: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(ActionsButtons);

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StartStopButton from './StartStopButton';
import { setIisAction, whitelistApp, setNote } from '../../actions/actions';
import WhitelistButton from './WhitelistButton';
import NoteControl from './NoteControl';


const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const ActionsButtons = (props) => {
  const onSet = () => props.set(props);
  const onWhitelist = () => props.whitelist(props);
  return (
    <div className="actions-main">
      <StartStopButton running={props.running} click={onSet} />
      <WhitelistButton whitelisted={props.whitelisted} click={onWhitelist} />
      <NoteControl click={props.saveNote} note={props.note} name={props.name} />
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  set: (item) => {
    const data =
    {
      appPools: flatten(item.apps.map(x => x.children)),
      condition: item.running
    };
    dispatch(setIisAction(data));
  },
  whitelist: (item) => {
    const data =
    {
      appPools: flatten(item.apps.map(x => x.children)),
      condition: item.whitelisted
    };
    dispatch(whitelistApp(data));
  },
  saveNote: (data) => {
    dispatch(setNote(data));
  }
});

ActionsButtons.defaultProps = {
  note: ''
};

ActionsButtons.propTypes = {
  running: PropTypes.bool.isRequired,
  whitelisted: PropTypes.bool.isRequired,
  note: PropTypes.string,
  name: PropTypes.string.isRequired,
  set: PropTypes.func.isRequired,
  whitelist: PropTypes.func.isRequired,
  saveNote: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(ActionsButtons);

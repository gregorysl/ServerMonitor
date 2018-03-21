import React from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { runTask } from '../actions/actions';

const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const TaskActionButtons = (props) => {
  const onClick = () => props.set(props.Name);
  return (
    <div>
      <Icon onClick={onClick} type="star" />
    </div >);
};

const mapDispatchToProps = dispatch => ({
  set: (item) => {
    dispatch(runTask(item));
  }
});

TaskActionButtons.propTypes = {
  set: PropTypes.func.isRequired,
  Name: PropTypes.string.isRequired
};

export default connect(null, mapDispatchToProps)(TaskActionButtons);

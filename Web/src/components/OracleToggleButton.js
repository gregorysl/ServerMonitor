import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types';
import { setOracle } from '../actions/actions';

const OracleToggleButton = (props) => {
  const onClick = () => props.set(props.id, !props.isReserved);
  return (
    <Checkbox defaultChecked={props.isReserved} onClick={onClick} />
  );
};

const mapDispatchToProps = dispatch => ({
  set: (id, Reserve) => dispatch(setOracle({ id, Reserve }))
});

OracleToggleButton.propTypes = {
  set: PropTypes.func.isRequired,
  isReserved: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired
};

export default connect(null, mapDispatchToProps)(OracleToggleButton);

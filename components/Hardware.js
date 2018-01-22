import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getHardwareAction } from '../actions/actions';
import HardwareItem from './HardwareItem';


class Hardware extends Component {
  componentDidMount() {
    this.props.dispatch(getHardwareAction());
  }

  render() {
    const components = this.props.data.map(x => <HardwareItem key={x.key} item={x} />);
    return (
      <div>{components}</div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.hardware,
});

Hardware.propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps)(Hardware);

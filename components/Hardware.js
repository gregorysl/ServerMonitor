import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { getHardwareAction } from '../actions/actions';
import HardwareItem from './HardwareItem';

const { TabPane } = Tabs;

class Hardware extends Component {
  componentDidMount() {
    this.props.dispatch(getHardwareAction());
  }

  render() {
    const components = this.props.data.map(x => (
      <TabPane tab={x.key} key={x.key}>
        <HardwareItem item={x} />
      </TabPane>
    ));
    return (
      <Tabs tabPosition="left" >
        {components}
      </Tabs>
    );
  }
}

const mapStateToProps = state => ({
  data: state.hardware
});

Hardware.propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default connect(mapStateToProps)(Hardware);

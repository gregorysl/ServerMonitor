import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PageVisibility from 'react-page-visibility';
import { Tabs } from 'antd';
import { getHardwareAction } from '../actions/actions';
import HardwareItem from './HardwareItem';

const { TabPane } = Tabs;

class Hardware extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true
    };
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.dispatchChange = this.dispatchChange.bind(this);
  }

  componentDidMount() {
    setInterval(this.dispatchChange, 1000);
  }

  handleVisibilityChange(isVisible) {
    this.setState({ hidden: !isVisible });
  }

  dispatchChange() {
    if (!this.state.hidden) {
      this.props.dispatch(getHardwareAction());
    }
  }

  render() {
    const components = this.props.data.map(x => (
      <TabPane tab={x.key} key={x.key}>
        <HardwareItem item={x} />
      </TabPane>
    ));
    return (
      <PageVisibility onChange={this.handleVisibilityChange}>
        <Tabs tabPosition="left" >
          {components}
        </Tabs>
      </PageVisibility>
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

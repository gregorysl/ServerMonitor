import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'antd';
import PropTypes from 'prop-types';
import { getServicesAction } from '../actions/actions';


class ServicesList extends Component {
  componentDidMount() {
    this.props.dispatch(getServicesAction());
  }
  render() {
    return (
      <List
        bordered
        renderItem={item => (<List.Item>{item.name}</List.Item>)}
        dataSource={this.props.serviceData}
      />
    );
  }
}

const mapStateToProps = state => ({
  serviceData: state.service.data
});

ServicesList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  serviceData: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default connect(mapStateToProps)(ServicesList);

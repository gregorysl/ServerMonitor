import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'antd';
import PropTypes from 'prop-types';
import ServiceItem from './ServiceItem';
import { getServicesAction } from '../actions/actions';


class ServicesList extends Component {
  componentDidMount() {
    this.props.dispatch(getServicesAction());
  }
  render() {
    return (
      <List
        header={(<h1>Component Status</h1>)}
        bordered
        grid={{ column: 6 }}
        loading={this.props.service.loading}
        dataSource={this.props.service.data}
        renderItem={item => (<ServiceItem {...item} name={item.key} />)}
      />
    );
  }
}

const mapStateToProps = state => ({
  service: state.service
});

ServicesList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  service: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired
  }).isRequired
};

export default connect(mapStateToProps)(ServicesList);

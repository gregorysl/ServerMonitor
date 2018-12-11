import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import ServiceItem from './ServiceItem';
import { getServicesAction } from '../actions/actions';


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

class ServicesList extends Component {
  componentDidMount() {
    this.props.dispatch(getServicesAction());
  }

  render() {
    const cards = [];
    const types = this.props.service.data.map(x => x.type).filter(onlyUnique);
    const columns = Math.floor(24 / types.length);
    types.forEach((element) => {
      const items = this.props.service.data.filter(x => x.type === element);
      const inner = items.map(x => (<ServiceItem {...x} name={x.key} />));
      const car = (
        <Col span={columns} key={element}>
          <Card title={element}>
            {inner}
          </Card>
        </Col>);
      cards.push(car);
    });
    return (
      <React.Fragment>
        <h1>Component Status</h1>
        <Row>
          {cards}
        </Row>
      </React.Fragment>
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

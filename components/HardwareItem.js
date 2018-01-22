import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import Chart from './Chart/chart';

const HardwareItem = ({ item }) => {
  const childs = item.data
    .map(x => <Col key={x.key} span={8}><Chart title={x.key} percent={x.value} /></Col>);
  return (
    <Row>
      <h1>{item.key}</h1>
      <Row>
        {childs}
      </Row>
    </Row>
  );
};


HardwareItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default HardwareItem;

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import Chart from './Chart/chart';

const HardwareItem = ({ item }) => {
  const childs = item.data
    .map(x => <Col key={x.key} span={8}><Chart title={x.key} {...x} /></Col>);
  return (
    <Row>
      {childs}
    </Row>
  );
};


HardwareItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      Value: PropTypes.string
    }).isRequired)
  }).isRequired
};

export default HardwareItem;

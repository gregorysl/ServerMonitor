import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import Chart from './Chart/chart';

const HardwareItem = ({ data }) => {
  const childs = data.data.map(x => <Col span={8}><Chart title={x.key} percent={x.value} /></Col>);
  return (
    <Row>
      <h1>{data.key}</h1>
      <Row>
        {childs}
      </Row>
    </Row>
  );
};


// HardwareItem.propTypes = {
//   data: PropTypes.arrayOf(PropTypes.object).isRequired,
// };

export default HardwareItem;

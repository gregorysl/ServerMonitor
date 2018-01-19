import React from 'react';
import PropTypes from 'prop-types';
import { Progress, Card } from 'antd';

const Chart = ({ title, percent }) => (
  <Card title={title} >
    <Progress type="dashboard" percent={percent} />
  </Card>
);

Chart.propTypes = {
  title: PropTypes.string.isRequired,
  percent: PropTypes.string.isRequired,
};
export default Chart;

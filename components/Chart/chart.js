import React from 'react';
import PropTypes from 'prop-types';
import { Progress, Card } from 'antd';

const Chart = ({ title }) => (
  <Card title={title} >
    <Progress type="dashboard" percent={75} />
  </Card>
);

Chart.propTypes = {
  title: PropTypes.string.isRequired,
};
export default Chart;

import React from 'react';
import PropTypes from 'prop-types';
import { Progress, Card, Tag } from 'antd';
import filesize from 'filesize';

const Title = ({ title, text }) => (
  <div>
    {title}
    {text && <Tag>{filesize(text)}</Tag>}
  </div>
);
Title.defaultProps = { text: '' };

Title.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string
};

const Chart = ({ title, value, text }) => (
  <Card className="chart-card" title={(<Title text={text} title={title} />)}>
    <Progress type="dashboard" percent={value} />
  </Card>
);
Chart.defaultProps = { text: '' };

Chart.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  text: PropTypes.string
};
export default Chart;

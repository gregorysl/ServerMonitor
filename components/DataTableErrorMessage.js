import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

const DataTableErrorMessage = ({ title }) => (
  <React.Fragment>
    <Icon style={{ color: 'red' }} type="exclamation-circle" />
    <h3>{title}</h3>
  </React.Fragment>
);

DataTableErrorMessage.propTypes = {
  title: PropTypes.string.isRequired
};

export default DataTableErrorMessage;

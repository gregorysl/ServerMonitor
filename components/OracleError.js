import React from 'react';
import { Icon } from 'antd';

const OracleError = () => (
  <React.Fragment>
    <Icon style={{ color: 'red' }} type="exclamation-circle" />
    <h3>No Oracle Instances found</h3>
  </React.Fragment>
);

export default OracleError;

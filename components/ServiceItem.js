import React from 'react';
import { Card, Tooltip, List } from 'antd';
import PropTypes from 'prop-types';


const ServiceItem = props => (
  <Tooltip title={props.message}>
    <List.Item>
      <a target="blank" href={props.url}>
        <Card className={props.working ? 'green' : 'red'}>
          <h3>
            {props.name}
          </h3>
        </Card>
      </a>
    </List.Item>
  </Tooltip>
);

ServiceItem.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  working: PropTypes.bool.isRequired
};

export default ServiceItem;

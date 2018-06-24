import React from 'react';
import { Tooltip, List, Tag } from 'antd';
import PropTypes from 'prop-types';


const ServiceItem = props => (
  <Tooltip title={props.message}>
    <List.Item>
      <Tag
        color={props.working ? '#87d068' : '#f50'}
      >
        <a className="service-link" target="blank" href={props.url}>
          {props.name}
        </a>
      </Tag>
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

import React from 'react';
import { Button, Tooltip, List } from 'antd';
import PropTypes from 'prop-types';


const ServiceItem = props => (
  <Tooltip title={props.message}>
    <List.Item>
      <a className="service-link" target="blank" href={props.url}>
        <Button
          icon={props.working ? 'check' : 'close'}
          size="large"
          type={!props.working ? 'danger' : null}
          className={props.working ? 'green' : 'red'}
        >
          {props.name}
        </Button>
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

import React from 'react';
import { Button, Tooltip, List } from 'antd';
import PropTypes from 'prop-types';


const ServiceItem = props => (
  <Tooltip title={props.message}>
    <List.Item>
      <a className="service-link" target="blank" href={props.url}>
        <Button
          type={!props.working ? 'danger' : null}
          className={props.working ? 'green' : 'red'}
        >
          <h3>
            {props.name}
          </h3>
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

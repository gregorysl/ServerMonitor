import React, { useState, useEffect } from "react";
import { checkLink } from "../api/api_new";
import { Tooltip, Tag, Spin, Icon } from "antd";
import PropTypes from "prop-types";

function useEffectAsync(effect, inputs) {
  useEffect(() => {
    effect();
  }, inputs);
}

const antIcon = <Icon type="loading" spin />;

const ServiceItem = props => {
  const [message, setMessage] = useState();
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(true);
  const url = props.url;

  useEffectAsync(async () => {
    const result = await checkLink(url);
    const linkData = result.data.data;
    setLoading(false);
    setMessage(linkData.message);
    setStatus(linkData.working ? "#87d068" : "#f50");
  },[url]);

  return (
    <Tooltip title={message}>
      <Tag color={status}>
        <a className="service-link" target="blank" href={props.url}>
          {loading && <Spin size="small" indicator={antIcon} />}
          {props.name}
        </a>
      </Tag>
    </Tooltip>
  );
};

ServiceItem.propTypes = {
  url: PropTypes.string.isRequired
};

export default ServiceItem;

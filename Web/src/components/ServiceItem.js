import React, { useState, useEffect } from "react";
import { checkLink } from "../api/api_new";
import { Tooltip, Tag, Spin, Icon } from "antd";

const antIcon = <Icon type="loading" spin />;

const ServiceItem = ({ data, url }) => {
  const [message, setMessage] = useState();
  const [status, setStatus] = useState(false);
  const [color, setColor] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await checkLink(data, url);
      const linkData =
        result === null || result === undefined ? [] : result.data;
      setLoading(false);
      setMessage(linkData.message);
      setStatus(linkData.working);
      setColor(linkData.working ? "#87d068" : "#f50");
    }
    fetchData();
  }, [data, url]);

  return (
    <Tooltip title={message}>
      <Tag className="tag-height" color={color}>
        <a className="service-link" target="blank" href={data.url}>
          {loading && <Spin size="small" indicator={antIcon} />}
          {data.name}
        </a>
      </Tag>
    </Tooltip>
  );
};

export default ServiceItem;

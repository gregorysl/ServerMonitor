import React, { useState, useEffect } from "react";
import { getServerLinks } from "../../api/api_new";
import { Card, Row, Col,Tooltip, Tag, Spin, Icon } from "antd";
import PropTypes from "prop-types";
import ServiceItem from "../ServiceItem";

function useEffectAsync(effect, inputs) {
  useEffect(() => {
    effect();
  }, inputs);
}

const antIcon = <Icon type="loading" spin />;

const ServerLinks = props => {
//   const [message, setMessage] = useState();
//   const [status, setStatus] = useState();
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const url = props.url;

  useEffectAsync(async () => {
    const result = await getServerLinks(url);
    const linkData = result.data.data.links;

    setLoading(false);
    setLinks(linkData)
    // setMessage(linkData.message);
    // setStatus(linkData.working ? "#87d068" : "#f50");
  },[url]);
  const title =  (<a className="service-link" target="blank" href={props.url}>
         {loading && <Spin size="small" indicator={antIcon} />}
         {props.name}
       </a>);
  const data = links.map(x => <ServiceItem {...x} key={x.type} />);
  return (<Col xs={24} sm={12} md={12} lg={6} key={props.type}>
        <Card title={title}>{data}</Card>
      </Col>
  );
};

// ServerLinks.propTypes = {
//   url: PropTypes.string.isRequired
// };

export default ServerLinks;

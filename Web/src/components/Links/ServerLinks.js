import React, { useState, useEffect } from "react";
import { getServerLinks } from "../../api/api_new";
import { Card, Col, Spin, Icon } from "antd";
// import { Card, Row, Col,Tooltip, Tag, Spin, Icon } from "antd";
// import PropTypes from "prop-types";
import ServiceItem from "../ServiceItem";

const ServerLinks = props => {
  //   const [message, setMessage] = useState();
  //   const [status, setStatus] = useState();
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const url = props.url;

  useEffect(() => {
    async function fetchData() {
      const result = await getServerLinks(url);
      const linkData = result.data.data.links;

      // setMessage(linkData.message);
      // setStatus(linkData.working ? "#87d068" : "#f50");
      setLoading(false);
      setLinks(linkData);
    }
    fetchData();
  }, [url]);
  const data = links.map(x => <ServiceItem {...x} key={x.type} />);
  return (
    <Col xs={24} sm={12} md={12} lg={6} key={props.type}>
      {data}
    </Col>
  );
};

// ServerLinks.propTypes = {
//   url: PropTypes.string.isRequired
// };

export default ServerLinks;

import React from "react";
import { Row } from "antd";
import ServerLinks from "./Links/ServerLinks";

const ServicesList = props => {
  const data = props.settings ? (
    props.settings.hardwareList.map(x => <ServerLinks {...x} key={x.name} />)
  ) : (
    <h1>No component status data</h1>
  );
  return (
    <Row>
      <h1>Component Status</h1>
      {data}
    </Row>
  );
};

export default ServicesList;

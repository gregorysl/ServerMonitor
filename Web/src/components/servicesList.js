import React from "react";
import { Card, Row, Col } from "antd";
import ServiceItem from "./ServiceItem";

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const ServicesList = props => {
  const types = props.links.data.map(x => x.type).filter(onlyUnique);
  const data = types.map(t => {
    const items = props.links.data
      .filter(x => x.type === t)
      .map(x => <ServiceItem {...x} key={x.name} />);
    return (
      <Col xs={24} sm={12} md={12} lg={6} key={t}>
        <Card title={t}>{items}</Card>
      </Col>
    );
  });
  return (
    <React.Fragment>
      <h1>Component Status</h1>
      <Row>{data}</Row>
    </React.Fragment>
  );
};

export default ServicesList;

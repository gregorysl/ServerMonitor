import React, { useState } from "react";
import { Card, Row, Col } from "antd";
import ServiceItem from "./ServiceItem";

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const ServicesList = props => {
  const cards = [];
  const types = props.links.data.map(x => x.type).filter(onlyUnique);
  types.forEach(element => {
    const items = props.links.data.filter(x => x.type === element);
    const inner = items.map(x => <ServiceItem {...x} key={x.name} />);
    const columnCard = (
      <Col xs={24} sm={12} md={12} lg={6} key={element}>
        <Card title={element}>{inner}</Card>
      </Col>
    );
    cards.push(columnCard);
  });
  return (
    <React.Fragment>
      <h1>Component Status</h1>
      <Row>{cards}</Row>
    </React.Fragment>
  );
};

export default ServicesList;

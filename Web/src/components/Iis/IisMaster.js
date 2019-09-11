import React from "react";
import { Row } from "antd";
import "react-table/react-table.css";
import ServerLinks from "../Links/ServerLinks";
import IisSection from "./IisSection";

const IisServicesList = props => {
  const data = props.settings.hardwareList.map(x => (
    <Row key={x.name}>
      <Row>
        <h3>{x.name}</h3>
        <ServerLinks {...x} key={x.name} url={x.url} />
      </Row>
      <Row>
        <IisSection name={x.name} url={x.url} />
      </Row>
    </Row>
  ));
  return (
    <Row>
      <h1 className="table-title">IIS Applications</h1>
      {data}
    </Row>
  );
};

export default IisServicesList;

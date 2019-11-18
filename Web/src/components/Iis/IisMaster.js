import React from "react";
import { Row } from "antd";
import ServerLinks from "../Links/ServerLinks";
import Hardware from "../Hardware";
import IisSection from "./IisSection";

const IisServicesList = props => {
  const data = props.settings.hardwareList.map(x => (
    <div key={x.name} style={{ marginBottom: 5 }}>
      <Row type="flex" justify="left">
        <Row>
          <Row>
            <span className="app-title">{x.name}</span>
          </Row>
          <Row>
            <ServerLinks key={x.name} url={x.url} />
          </Row>
        </Row>
        <Hardware name={x.name} url={x.url} />
      </Row>
      <Row>
        <IisSection name={x.name} url={x.url} />
      </Row>
    </div>
  ));
  return (
    <Row>
      <h1 className="table-title">IIS Applications</h1>
      {data}
    </Row>
  );
};

export default IisServicesList;

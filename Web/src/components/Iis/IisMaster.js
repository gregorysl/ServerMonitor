import React from "react";
import { Row } from "antd";
import "react-table/react-table.css";
import IisSection from "./IisSection";


const IisServicesList = props => {
  const data = props.settings.hardwareList.map(x => (
    <Row key={x.name}>
      <h3>{x.name}</h3>
      <IisSection name={x.name} url={x.url} />
    </Row>
  ));
  return (
    <Row>
      <h1 className='table-title'>IIS Applications</h1>
      {data}
    </Row>
  );
};

export default IisServicesList;

import React from "react";
import SimpleTable from "./table";
import Chart from "./Chart/chart";
import {  Row, Col  } from 'antd'

const App = () => {
  return (
    <div>
      <Row>
        <Col span={8}><Chart title={"Processor"}/></Col>
        <Col span={8}><Chart title={"Processo1r"}/></Col>
        <Col span={8}><Chart title={"Process2r"}/></Col>
      </Row>
      <SimpleTable/>
    </div>
  );
};

export default App;

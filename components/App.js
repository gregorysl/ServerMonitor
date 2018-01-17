import React from 'react';
import { Row, Col } from 'antd';
import SimpleTable from './table';
import ServicesList from './servicesList';
import Chart from './Chart/chart';

const App = () => (
  <div>
    <Row>
      <Col span={8}><Chart title="Processor" /></Col>
      <Col span={8}><Chart title="Processo1r" /></Col>
      <Col span={8}><Chart title="Process2r" /></Col>
    </Row>
    <SimpleTable />
    <ServicesList />
  </div>
);

export default App;

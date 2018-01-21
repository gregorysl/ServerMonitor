import React from 'react';
import SimpleTable from './table';
import ServicesList from './servicesList';
import Hardware from './Hardware';

const App = () => (
  <div>
    {/* <Row>
      <Col span={8}><Chart title="Processor" percent={12} /></Col>
      <Col span={8}><Chart title="HDD" percent={75} /></Col>
      <Col span={8}><Chart title="Ram" percent={23} /></Col>
    </Row> */}
    <Hardware />
    <SimpleTable />
    <ServicesList />
  </div>
);

export default App;

import React from 'react';
import IisTable from './Iis/IisTable';
import ServicesList from './servicesList';
import Hardware from './Hardware';

const App = () => (
  <div>
    <Hardware />
    <IisTable />
    <ServicesList />
  </div>
);

export default App;

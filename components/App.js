import React from 'react';
import IisTable from './Iis/IisTable';
import ServicesList from './servicesList';
import Hardware from './Hardware';
import DiskUsage from './Iis/DiskUsage';
import ScheduledTable from './Iis/ScheduledTable';

const App = () => (
  <div>
    <ScheduledTable />
    <DiskUsage />
    <Hardware />
    <IisTable />
    <ServicesList />
  </div>
);

export default App;

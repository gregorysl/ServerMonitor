import React from 'react';
import { render } from "react-dom";
import Table from './Table'

class App extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <Table/>
    );
  }
}
export default App;
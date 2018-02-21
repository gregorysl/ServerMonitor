

import 'antd/dist/antd.less';
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/App';
import './styles/style.less';


const rootDiv = document.getElementById('app');
const Item = (
  <Provider store={store}>
    <App />
  </Provider>);
render(Item, rootDiv);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const newApp = require('./components/App').default;
    render(newApp);
  });
}

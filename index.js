import './styles/style.scss';
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/App';
  
const rootDiv = document.getElementById('app');

render( 
  <Provider store={store}>
    <App/>
  </Provider>, rootDiv);

if (module.hot) {
  module.hot.accept();
}
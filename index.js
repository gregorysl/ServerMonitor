import './styles/style.scss';
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/App';
import { LocaleProvider } from 'antd';
import moment from 'moment';
moment.locale('en-gb');
import 'moment/locale/en-gb'
import 'moment/src/locale/en-gb'
import enUS from 'antd/es/locale-provider/en_GB'
import 'antd/dist/antd.less';
  
const rootDiv = document.getElementById('app');

render( 
  
  <LocaleProvider locale={enUS}>
  <Provider store={store}>
    <App/>
  </Provider>
  </LocaleProvider>, rootDiv);

if (module.hot) {
  module.hot.accept();
}
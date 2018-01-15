
import 'moment/locale/en-gb';
import 'moment/src/locale/en-gb';
import enUS from 'antd/es/locale-provider/en_GB';
import 'antd/dist/antd.less';
import 'babel-polyfill';
import React from 'react';
import { LocaleProvider } from 'antd';
import moment from 'moment';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/App';
import './styles/style.less';

moment.locale('en-gb');


const rootDiv = document.getElementById('app');
const Item = (
  <LocaleProvider locale={enUS}>
    <Provider store={store}>
      <App />
    </Provider>
  </LocaleProvider>);
render(Item, rootDiv);

if (module.hot) {
  module.hot.accept();
}

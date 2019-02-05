import 'antd/dist/antd.less';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import './styles/style.sass';

const Item = (
    <Provider store={store}>
      <App />
    </Provider>);
ReactDOM.render(Item, document.getElementById('root'));


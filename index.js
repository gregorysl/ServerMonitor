import './styles/style.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';  
import configureStore from './store/configureStore';
import App from './components/App';

const rootDiv = document.getElementById('app');
const store = configureStore();

ReactDOM.render( 
	<Provider store={store}>
		<App />
  	</Provider>, rootDiv)

if (module.hot) {
	module.hot.accept();
}
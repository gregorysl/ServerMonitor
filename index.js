import './styles/style.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const rootDiv = document.getElementById('app');

ReactDOM.render(<App />, rootDiv)

if (module.hot) {
	module.hot.accept();
}
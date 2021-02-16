import React from 'react';
import ReactDOM from 'react-dom';
import { Main } from './components/Main';
import reportWebVitals from './reportWebVitals';
import './css/index.css';

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

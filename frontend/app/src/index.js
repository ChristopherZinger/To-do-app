import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, compose } from 'redux';
import { reducer, initialState } from './store/reducer';
import { Provider } from 'react-redux';
import axios from 'axios';



// axios global settings 
axios.defaults.headers.common['authorization'] = 'AUTH TOKEN';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = 'http://localhost:4000';

// this will make redux devTools work
const enhancers = compose(
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const store = createStore(reducer, initialState, enhancers);



// Main stuff
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

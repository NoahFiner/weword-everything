import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import RouterOuter from './components/Router/index';
import * as serviceWorker from './serviceWorker';

import {Provider} from 'react-redux';
import store from './redux/store';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-59921773-10');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
    <Provider store={store}>
        <RouterOuter />
    </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

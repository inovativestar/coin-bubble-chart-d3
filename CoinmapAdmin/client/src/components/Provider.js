import React from "react";
import { Provider } from 'react-redux';
import App from './App';
import createStore from '../store/createStore';
import history from '../history';

const store = createStore();


export default (
    <Provider store={store}>
        <App history={history} />
    </Provider>
);

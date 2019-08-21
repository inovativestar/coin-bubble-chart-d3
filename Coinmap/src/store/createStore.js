import { createStore as _createStore, applyMiddleware } from 'redux';
import reducers     from '../reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';


export default function createStore(initialState) {
    const store = _createStore(
        reducers,
        initialState,
        applyMiddleware(thunk, logger)
    );
    return store;
}
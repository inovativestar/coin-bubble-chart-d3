import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import reducers     from '../reducers';
import middlewares   from '../middlewares';
import thunk from 'redux-thunk';
import logger from 'redux-logger';


export default function createStore(initialState) {
    const store = _createStore(
        reducers,
        initialState,
		compose(
            applyMiddleware(...middlewares)
        ),
    );
    return store;
}
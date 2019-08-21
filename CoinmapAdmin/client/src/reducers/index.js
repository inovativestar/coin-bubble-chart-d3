import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import auth from './authReducer';
import hierarchy from './hierarchyReducer';
export default combineReducers({
	auth,
	hierarchy,
	routerReducer
});

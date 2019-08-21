import * as ActionTypes from '../actions/action-types'
import { changePassword } from '../actions/auth';

const defaultState = {
	isLoading: false,
	login: false,
	token: null,
	user: null,
	errorText: "",
	changePasswordSuccess: false

};

export default function authReducer(state = defaultState, action) {
	switch(action.type) {
		case ActionTypes.AUTH_AUTH:
			return {
				...state,
				isLoading: true,
				login: false
			}
		case ActionTypes.AUTH_AUTH_SUCCESS:
			if(action.data.token) {
				let storage = window.localStorage;
				storage.setItem('token', action.data.token);
			}
			return {
				...state,
				token : action.data.token,
				user : action.data.user,
				login : true,
				errorText: ""

			}
		case ActionTypes.AUTH_AUTH_FAILURE:
			let storage = window.localStorage;
			storage.removeItem('token');
			return {
				...state,
				login: false,
				errorText: action.error || ""
			}
		case ActionTypes.USER_CHANGE_PASSWORD:
			return { ...state, isLoading: true, changePasswordSuccess: false }
		case ActionTypes.USER_CHANGE_PASSWORD_SUCCESS:
			return { ...state, isLoading: false, changePasswordSuccess: true }
		case ActionTypes.USER_CHANGE_PASSWORD_FAILURE:
			return { ...state, isLoading: false, changePasswordSuccess: false }
			
		case ActionTypes.AUTH_UNAUTHORIZED:
		case ActionTypes.AUTH_LOGOUT:
			storage = window.localStorage;
			storage.removeItem('token');
			return { ...state, token: null, login: false}
		default:
			return state;
	}
}
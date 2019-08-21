import { api, route } from '../config'
import * as ActionTypes from '../actions/action-types'

export function auth(credential) {

	var action = (dispatch, getState) => {
        
        var body = credential;
		dispatch({
			type: ActionTypes.AUTH_AUTH,
			isLoading: true
		});

		const defaults = {
    		headers: {
	    		'Accept': 'application/json',
		    	'Content-Type': 'application/json',
			}
		}

		const request = {
			url: api.baseURL + '/auth/login',
            method: 'post',
            body: JSON.stringify(body)
		}

		fetch(request.url, {...defaults, ...request})
		.then(res => { 
			console.log(res);
			if (res.ok) {
				res.json()
				.then(data=>{
					dispatch({ type: ActionTypes.AUTH_AUTH_SUCCESS, data: data})

				})
                    
			}  else {
				console.log(res.err)
				dispatch({ type: ActionTypes.AUTH_AUTH_FAILURE, error: "Invaild email or password."})
			}
		})
		.catch(error => {
			dispatch({ type: ActionTypes.AUTH_AUTH_FAILURE, error: "Server error."})
			return false;
		});
	}

	return action;
}

export function changePassword(oldPassword, newPassword) {
	let data = { oldPassword, newPassword }
	return {
		  type: ActionTypes.USER_CHANGE_PASSWORD,
		  request: {
		  url: api.baseURL + '/user/changePassword',
		  method: 'post',
		  body: JSON.stringify(data)
		  }
	  }
}

export function logout() {
	return {
		type: ActionTypes.AUTH_LOGOUT
	}
}
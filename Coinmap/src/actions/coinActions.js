import { api } from '../config'
import { dataFormater } from '../helpers/dataFormater';
export function fetchCoinData() {

	var action = (dispatch, getState) => {

		dispatch({
			type: 'GET_COIN_DATA',
			isLoading: true
		});

		const defaults = {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}

		const request = {
			url: api.baseURL + '/node',
			method: 'get'
		}

		fetch(request.url, { ...defaults, ...request })
			.then(res => {
				if (res.ok) {
					res.json()
						.then(data => {
							dispatch({ type: 'GET_COIN_DATA_SUCCESS', data: data })
						})
				} else {
					console.log(res.err)
					dispatch({ type: 'GET_COIN_DATA_FAILURE' })
				}
			})
			.catch(error => {
				dispatch({ type: 'GET_COIN_DATA_FAILURE' })
				console.log(error);
				return false;
			});
	}

	return action;
}

export function showNode(nodeName) {
	console.log("nodename", nodeName)
	return {
		type: 'SHOW_NODE',
		showNode: nodeName
	}
}

export function backNode() {
	return {
		type: 'BACK_NODE'
	}
}

export function changeShowType(typeName) {
	return {
		type: 'CHANGE_SHOW_TYPE',
		showType: typeName
	}
}

export function HideSideBar() {
	return {
		type: 'HIDE_SIDEBAR'
	}
}


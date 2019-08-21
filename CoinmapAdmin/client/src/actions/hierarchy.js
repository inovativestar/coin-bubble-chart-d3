import { api, route } from '../config'
import * as ActionTypes from '../actions/action-types'

export function getHierarchy() {
    return {
		type: ActionTypes.HIERARCHY_GET_HIERARCHY,
		request: {
            url: api.baseURL + '/hierarchy',
            method: 'get'
		}
	}
}
export function getHierarchyNode(symbol) {
	return {
		  type: ActionTypes.HIERARCHY_GET_HIERARCHY_NODE,
		  request: {
		  url: api.baseURL + '/hierarchy/'+symbol,
		  method: 'get'
		  }
	  }
}
export function getHierarchyNodeById(id) {
	return {
		  type: ActionTypes.HIERARCHY_GET_HIERARCHY_NODE,
		  request: {
		  url: api.baseURL + '/hierarchyById/'+id,
		  method: 'get'
		  }
	  }
}

export function createHierarchyNode(node){
    return {
		type: ActionTypes.HIERARCHY_CREATE_HIERARCHY_NODE,
		request: {
            url: api.baseURL + '/hierarchy',
		method: 'put',
		body: JSON.stringify(node)
		}
	}
}

export function updateHierarchyNode(id, node) {
	return {
		type: ActionTypes.HIERARCHY_CREATE_HIERARCHY_NODE,
		request: {
            url: api.baseURL + '/hierarchy/'+ id,
		method: 'post',
		body: JSON.stringify(node)
		}
	}
}

export function removeHierarchyNode(id){
    return {
		type: ActionTypes.HIERARCHY_DELETE_HIERARCHY_NODE,
		request: {
            url: api.baseURL + '/hierarchy/'+id,
            method: 'delete'
		},
		id
	}
    
}

export function editHierarchyNode(node){
	return {
		type: ActionTypes.HIERARCHY_EDIT_HIERARCHY_NODE,
		data:  node
	}

}
import * as ActionTypes from '../actions/action-types'

const defaultState = {
	isLoading: false,
	currentNode: null,
	selectedNode: null,
    success: false,
	hasError: false,
	navList: []
};

export default function hierarchyReducer(state = defaultState, action) {
	switch(action.type) {
		case ActionTypes.HIERARCHY_GET_HIERARCHY_NODE:
			return { ...state, isLoading: true, success: false }
		case ActionTypes.HIERARCHY_GET_HIERARCHY_NODE_SUCCESS:
			return { ...state, isLoading: false, success: true, currentNode : action.data }
		case ActionTypes.HIERARCHY_GET_HIERARCHY_NODE_FAILURE:
			return { ...state, isLoading: false, success: false }

		case ActionTypes.HIERARCHY_CREATE_HIERARCHY_NODE:
			return { ...state, isLoading: true, success: false }
		case ActionTypes.HIERARCHY_CREATE_HIERARCHY_NODE_SUCCESS:
			return { ...state, isLoading: false, success: true }
		case ActionTypes.HIERARCHY_CREATE_HIERARCHY_NODE_FAILURE:
			return { ...state, isLoading: false, success: false }
		
		case ActionTypes.HIERARCHY_DELETE_HIERARCHY_NODE:
			return { ...state, isLoading: true, success: false }
		case ActionTypes.HIERARCHY_DELETE_HIERARCHY_NODE_SUCCESS:
			if(state.currentNode && state.currentNode.children) {
				console.log(action.id);
				let currentNode = state.currentNode;
				let children =currentNode.children;
				let newChildren = [];
				for(let i=0; i<children.length; i++) {
					if(children[i]._id != action.id)
					newChildren.push(children[i]);
				}
				currentNode.children = newChildren;
				return { ...state, isLoading: false, success: true, currentNode }
			}else {
				return { ...state, isLoading: false, success: true }
			}
		
		case ActionTypes.HIERARCHY_DELETE_HIERARCHY_NODE_FAILURE:
			return { ...state, isLoading: false, success: false }
		case ActionTypes.HIERARCHY_EDIT_HIERARCHY_NODE:
		return { ...state, selectedNode: action.data }
		default:
			return state;
	}
}
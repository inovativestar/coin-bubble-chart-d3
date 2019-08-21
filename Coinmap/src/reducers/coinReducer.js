const defaultState = {
	coinHierarchy: null,
	displayCoinData: [],
	isLoading: false,
	showNode: "root",
	showType: "marketCapUsd", //  volumeUsd24Hr 
};

export default function coinReducer(state = defaultState, action) {
	switch (action.type) {
		case 'GET_COIN_DATA':
			return {
				...state,
				isLoading: true
			}
		case 'GET_COIN_DATA_FAILURE':
			return {
				...state,
				isLoading: false
			}

		case 'GET_COIN_DATA_SUCCESS':
			let hierarchy = {};
			for (let i = 0; i < action.data.length; i++) {
				hierarchy[action.data[i].symbol] = action.data[i];
			}
			return {
				...state,
				coinHierarchy: hierarchy,
				isLoading: false
			};
		case 'SHOW_NODE':
			let hasParent = checkParentNode(action.showNode, state.coinHierarchy);
			if (!hasParent) {
				return { ...state, isLastNode: true, lastChildName: action.showNode, showSidebar: true };
			}

			let coinData = changeShowNode(action.showNode, state.showType, state.coinHierarchy);
			return {
				...state,
				showNode: action.showNode,
				displayCoinData: coinData,
				isLastNode: false,
				lastChildName: '',
				showSidebar: true,
			};
		case 'CHANGE_SHOW_TYPE':
			coinData = changeShowNode(state.showNode, action.showType, state.coinHierarchy);
			return {
				...state,
				showType: action.showType,
				displayCoinData: coinData,
				showSidebar: true
			};
		case 'BACK_NODE':
			let node = state.coinHierarchy[state.showNode];
			if (node && node.parent) {
				let coinData = changeShowNode(node.parent, state.showType, state.coinHierarchy);
				return {
					...state,
					showNode: node.parent,
					displayCoinData: coinData,
					isLastNode: false,
					lastChildName: ''
				}
			} else {
				return state;
			}

		case 'HIDE_SIDEBAR':
			return { ...state, showSidebar: false }

		default:
			return state;
	}
}

function changeShowNode(showNode, showType, coinHierarchy) {
	let showNodeList = [];
	let node = coinHierarchy[showNode];
	if (!node) node = coinHierarchy['root'];
	if (node) {
		if (node.children) {
			let minValue = 0;
			let maxValue = 0;
			node.children.map(item => {
				let childNodeName = item.symbol;
				let childNode = coinHierarchy[childNodeName];

				if (childNode) {
					if (childNode[showType])
						childNode.value = childNode[showType];
					else
						childNode.value = childNode["marketCapUsd"];
					if (childNode.value > 0) {
						let newNode = {}
						if (minValue == 0)
							minValue = childNode.value;
						if (minValue > childNode.value)
							minValue = childNode.value;
						if (maxValue < childNode.value)
							maxValue = childNode.value;
						newNode.label = childNode.label;
						newNode.value = childNode.value;
						newNode.realValue = childNode.value;
						newNode.id = childNode.id;
						newNode.detail = childNode.data;
						showNodeList.push(newNode);
					}

				}
			})

			if (maxValue / minValue > 12) {
				let rate = (maxValue / minValue) / 10;
				showNodeList = showNodeList.map(showNode => {
					showNode.value = ((showNode.value - minValue) / rate + minValue);
					return showNode;
				})
			}

		} else {
			if (node[showType])
				node.value = node[showType];
			else
				node.value = node["marketCapUsd"];
			let newNode = {}
			newNode.label = node.symbol;
			newNode.value = node.value;
			newNode.id = node.id;
			showNodeList.push(newNode);
		}
		return showNodeList;
	} else {
		return [];
	}

}

function checkParentNode(nodeName, coinHierarchy) {
	let node = coinHierarchy[nodeName];
	if (node && node.children) {
		return true;
	}
	return false;
}

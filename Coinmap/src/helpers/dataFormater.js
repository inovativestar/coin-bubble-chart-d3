const hierarchy = require('./hierarchy.json')
var coinData = {}
var mapData = {};
export function dataFormater(data){ 

    mapData ={};
    data.data.map(coinItem => {
        mapData[coinItem.symbol] = {
            id : coinItem.symbol,
            label : coinItem.symbol,
            marketCapUsd  : parseFloat(coinItem.marketCapUsd ),
            volumeUsd24Hr : parseFloat(coinItem.volumeUsd24Hr),
            data : coinItem
        };
    })
    
    coinData = {}
    contributeNode("root", "");
    console.log(coinData);
    return coinData;
}

function contributeNode(nodeName, parentName) {
    //check from hierarchy
    let node = null;
    if(hierarchy[nodeName])
        node = hierarchy[nodeName];
    if(mapData[nodeName])
        node = mapData[nodeName];
    if(!node) {
        node = {};
        console.log(nodeName + " is not exist in data hierarchy");
        node.id = nodeName;
        node.label = nodeName;
        node.marketCapUsd = 0;
        node.volumeUsd24Hr = 0;
        node.parent = parentName;
        coinData[nodeName] = node;
        return node;
    }

    //check children

    if(node.children) {
        let marketCapUsd = 0;
        let volumeUsd24Hr = 0;
        node.children.map(childNodeName => {
           let formatedNode = contributeNode(childNodeName, nodeName);
           marketCapUsd += formatedNode.marketCapUsd;
           volumeUsd24Hr += formatedNode.volumeUsd24Hr;

        })
        node.marketCapUsd = marketCapUsd;
        node.volumeUsd24Hr = volumeUsd24Hr;
    }

    coinData[nodeName] = node;
    return node;
}


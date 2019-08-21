'use strict';
var _              = require('lodash');
var Promise        = require('bluebird');
var customErrors   = require('n-custom-errors');
var consts         = require('../consts');
var validationUtil = require('../util/validations');
var config         = require('../../config/environment');
var log            = require('../util/logger').logger;
var request        = require('request');
var hierarchySrvc  = require('../data-services/hierarchy');
var nodeSrvc       = require('../data-services/node');

var coinCapUrl     = 'https://api.coincap.io/v2';


var Service = function(opts){
  this.interval = opts.interval||300000;
};


module.exports = Service;

Service.prototype.run = function () {
  this.interval = setInterval(this.tick.bind(this), this.interval);
};

Service.prototype.close = function () {
  clearInterval(this.interval);
};

Service.prototype.tick = function() {
    Service.fetchCoinCampData();
};

Service.fetchCoinCampData = function () {
    var rootHierarchyId = null;
    let hierarchyMap = {};
    let coinData = {};
    let mapData = {};
    request(coinCapUrl+'/assets?limit=1000', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                loadHierarchyData()
                .then((hierarchyData)=> formatHierarchyData(hierarchyData))
                .then((formatedHierarchyData)=> formatData(body))
                .then((coinData)=> saveNodeData())

            }
    })

    function saveNodeData() {
        nodeSrvc.deleteAllNode()
        .then(()=>addAllNodes());

        function addAllNodes(){
          for(let node in coinData) {
            nodeSrvc.createNode(coinData[node])
          }
        }


    }

    function loadHierarchyData() {
      return hierarchySrvc
      .getHierarchy({}, 'label parent isLeaf symbol children description')
      .then(hierarchyData => {
        return hierarchyData;
      })
    }
    function formatHierarchyData (data) {
       data.map(hierarchyNode => {
        if(hierarchyNode.symbol) {
          hierarchyMap[hierarchyNode.symbol] = hierarchyNode;
        }
        else {
          let symbol = getSymbolFromLabel(hierarchyNode.label)
          hierarchyMap[symbol] = hierarchyNode;
        }
      })
      return hierarchyMap;
    }

    function getSymbolFromLabel(label) {
      let symbol = label.toLowerCase();
      symbol = symbol.replace(" ", "_");
      return symbol;
    }

    function formatData (json) {
      let data = JSON.parse(json);

      data.data.map(coinItem => {
        mapData[coinItem.symbol] = {
            symbol : coinItem.symbol,
            label : coinItem.symbol,
            marketCapUsd  : parseFloat(coinItem.marketCapUsd ),
            volumeUsd24Hr : parseFloat(coinItem.volumeUsd24Hr),
            data : coinItem,
            isLeaf : true
        };
    })

    coinData = {}
    contributeNode("root", "");
    return coinData;

  }
  function contributeNode(nodeName, parentName) {
    //check from hierarchy
    let node = null;
    if(hierarchyMap[nodeName] && !hierarchyMap[nodeName].isLeaf) {
      node = hierarchyMap[nodeName];
    }

    if(mapData[nodeName]) {
        node = mapData[nodeName];
        if(hierarchyMap[nodeName].description){
          node.description = hierarchyMap[nodeName].description;
        }
        node.parent = parentName;
    }

    if(!node) {
        node = {};
        node.symbol = nodeName;
        node.label = nodeName;
        node.marketCapUsd = 0;
        node.volumeUsd24Hr = 0;
        node.description = '';
        node.parent = parentName;
        coinData[nodeName] = node;
        return node;
    }

    //check children

    if(node.children) {
        let marketCapUsd = 0;
        let volumeUsd24Hr = 0;
        let children = [];
        node.children.map(childNode => {
          let childNodeName = childNode.symbol;
          let isLeaf = childNode.isLeaf? childNode.isLeaf : false;
          children.push({symbol: childNodeName, isLeaf : isLeaf});
           let formatedNode = contributeNode(childNodeName, nodeName);
           marketCapUsd += formatedNode.marketCapUsd;
           volumeUsd24Hr += formatedNode.volumeUsd24Hr;

        })
        let newNode = {
          children: children,
          label : node.label,
          description : node.description,
          marketCapUsd: marketCapUsd,
          volumeUsd24Hr: volumeUsd24Hr,
        }
        if(node.symbol)
          newNode.symbol = node.symbol;
        if(node.parent)
          newNode.parent = parentName;
        node = newNode;
    }

    coinData[nodeName] = node;
    return node;
  }
}

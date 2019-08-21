'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var customErrors = require('n-custom-errors');
var consts = require('../consts');
var hierarchySrvc = require('../data-services/hierarchy');
var validationUtil = require('../util/validations');

exports.find = function (req, res, next) {
  hierarchySrvc
    .getHierarchy({}, 'label parent isLeaf symbol children')
    .then(hierarchyData => res.send(hierarchyData))
    .catch(next);
};

exports.findById = function (req, res, next) {
  let _id = req.params._id;
  hierarchySrvc
    .getHierarchyOneNode({ _id: _id }, 'label parent isLeaf symbol children')
    .then(hierarchyData => res.send(hierarchyData))
    .catch(next);
}

exports.findBySymbol = function (req, res, next) {
  let _symbol = req.params._symbol;
  hierarchySrvc
    .getHierarchyOneNode({ symbol: _symbol }, 'label parent isLeaf symbol children')
    .then(hierarchyData => res.send(hierarchyData))
    .catch(next);
}

exports.create = function (req, res, next) {
  function parseParams(req) {

    var body = req.body;
    var allowedFields = ['label', 'parent', 'isLeaf', 'symbol', 'description'];
    var reqData = _.pick(body, allowedFields);

    return Promise.resolve(reqData);
  }

  function validateParams(reqData) {

    return Promise.resolve(reqData);
  }

  function doEdits(reqData) {
    var data = _.assign({}, reqData);
    if (data.label && !data.symbol) {
      console.log(data.label);
      data.symbol = getSymbolFromLabel(data.label);
    }
    return Promise.resolve(data);
  }
  function getSymbolFromLabel(label) {
    let symbol = label.toLowerCase();
    symbol = symbol.replace(" ", "_");
    return symbol;
  }
  function updateParentNode(createdHierarchyNode) {
    if (createdHierarchyNode.parent)
      return hierarchySrvc.getHierarchyOneNode({ _id: createdHierarchyNode.parent })
        .then(foundHierarchyNode => {
          if (!foundHierarchyNode)
            return createdHierarchyNode;
          return hierarchySrvc.addChild(foundHierarchyNode, createdHierarchyNode)
            .then(result => {
              return createdHierarchyNode;
            })
        })
    else
      return createdHierarchyNode;
  }

  parseParams(req)
    .then(validateParams)
    .then(doEdits)
    .then(data => hierarchySrvc.createHierarchyNode(data))
    .then(createdHierarchyNode => updateParentNode(createdHierarchyNode))
    .then(createdHierarchyNode => res.send(createdHierarchyNode))
    .catch(next);
};



exports.update = function (req, res, next) {
  var _id = req.params._id;
  function parseParams(req) {
    var body = req.body;
    var allowedFields = ['label', 'symbol', 'isLeaf', 'description'];
    var paramData = _.pick(body, allowedFields);
    if (paramData.label && !paramData.symbol) {
      paramData.symbol = getSymbolFromLabel(paramData.label);
    }
    paramData._id = _id;
    return Promise.resolve(paramData);
  }
  function getSymbolFromLabel(label) {
    let symbol = label.toLowerCase();
    symbol = symbol.replace(" ", "_");
    return symbol;
  }
  function validateParams(data) {
    if (!data.label) {
      return customErrors.rejectWithUnprocessableRequestError({ paramName: 'label', errMsg: 'must be a valid string' });
    }
    return Promise.resolve(data);
  }

  function doEdits(data) {
    _.extend(data.foundHierarchyNode, data.paramData);
    return data.foundHierarchyNode;
  }

  function checkAlreadyUsedExist(data) {

    return hierarchySrvc.getHierarchyOneNodeWithoutError({ _id: { "$ne": _id }, symbol: data.symbol })
      .then(result => {
        if (result) {
          return customErrors.rejectWithUnprocessableRequestError('Hierarchy node is already Exist');
        }
        return Promise.resolve(data)
      })
  }

  parseParams(req)
    .then(validateParams)
    .then(paramData => hierarchySrvc
      .getHierarchyOneNode({ _id: paramData._id })
      .then(foundHierarchyNode => {
        return { foundHierarchyNode, paramData };
      })
    )
    .then(doEdits)
    .then(checkAlreadyUsedExist)
    .then(hierarchyNode => hierarchySrvc.saveHierarchyNode(hierarchyNode))
    .then(saveHierarchyNode => res.send(saveHierarchyNode))
    .catch(next);
};

exports.delete = (req, res, next) => {
  var hierarchyNodeId = req.params._id;

  function updateParentNode(createdHierarchyNode) {
    if (createdHierarchyNode.parent)
      return hierarchySrvc.getHierarchyOneNode({ _id: createdHierarchyNode.parent })
        .then(foundHierarchyNode => {
          if (!foundHierarchyNode)
            return createdHierarchyNode;
          return hierarchySrvc.removeChild(foundHierarchyNode, createdHierarchyNode)
            .then(result => {
              return createdHierarchyNode;
            })
        })
    else
      return createdHierarchyNode;
  }

  function deleteAllInHierarchyBelowNode(node) {
    if (node.children && node.children.length > 0) {
      node.children.map(childNode => {
        deleteAllInHierarchyBelowNode(childNode);
      })
    }

    hierarchySrvc.getHierarchyOneNode({ _id: node._id })
      .then(result => {
        if (result) {
          hierarchySrvc.deleteHierarchyNode(result);
        }
      })

    return true;
  }

  function validateParams() {
    if (!validationUtil.isValidObjectId(hierarchyNodeId)) {
      return customErrors.rejectWithUnprocessableRequestError({ paramName: 'id', errMsg: 'must be a valid id' });
    }
    return Promise.resolve();
  }

  validateParams()
    .then(() => hierarchySrvc.getHierarchyOneNode({ _id: hierarchyNodeId }))
    .then((foundHierarchyNode) => updateParentNode(foundHierarchyNode))
    .then(hierarchyNode => deleteAllInHierarchyBelowNode(hierarchyNode))
    .then(result => res.send(true))
    .catch(next);
};

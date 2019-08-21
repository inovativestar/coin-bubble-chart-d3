'use strict';

var customErrors = require('n-custom-errors');
var Hierarchy = require('mongoose').model('hierarchy');

exports.getHierarchy = (filter, keys) => {
  return Hierarchy
    .find(filter, keys)
    .populate('children')
    .exec();
};



exports.getHierarchyOneNode = (filter, keys) => {
  return Hierarchy
    .findOne(filter)
    .select(keys)
    .populate('children')
    .exec()
    .then(hierarchyNode => {
      if (!hierarchyNode) {
        return customErrors.rejectWithObjectNotFoundError('Hierarchy node is not found');
      }
      return hierarchyNode;
    });
};

exports.getHierarchyOneNodeWithoutError = (filter, keys) => {
  return Hierarchy
    .findOne(filter)
    .select(keys)
    .populate('children')
    .exec()
    .then(hierarchyNode => {
      if (!hierarchyNode) {
        return null;
      }
      return hierarchyNode;
    });
};

exports.addChild = (parentNode, childNode) => {
  var filter = {
    _id: parentNode._id,
    "children": { "$ne": childNode._id }
  };

  var subfilter = {
    $push: { children: childNode._id }
  };
  return Hierarchy
    .update(filter, subfilter)
    .exec();
}

exports.removeChild = (parentNode, childNode) => {
  var filter = {
    _id: parentNode._id,
  };

  var subfilter = {
    $pull: { children: childNode._id }
  };
  return Hierarchy
    .update(filter, subfilter)
    .exec();
}

exports.createHierarchyNode = data => {
  var filter = {
    symbol: (data.symbol || '').toLowerCase()
  };

  return Hierarchy
    .count(filter)
    .then(cnt => {
      if (cnt > 0) {
        return customErrors.rejectWithDuplicateObjectError('This label is already in use');
      }
      console.log("data", data);
      return Hierarchy.create(data);
    });
};

exports.saveHierarchyNode = hierarchyNode => {
  return hierarchyNode.save();
};

exports.deleteHierarchyNode = hierarchyNode => {
  return hierarchyNode.remove();
};
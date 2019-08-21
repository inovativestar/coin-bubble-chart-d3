'use strict';

var customErrors = require('n-custom-errors');
var Node    = require('mongoose').model('node');

exports.getNode = (filter, keys) => {
  return Node
    .find(filter, keys)
    .exec();
};



exports.getOneNode = (filter, keys) => {
  return Node
    .findOne(filter)
    .select(keys)
    .exec()
    .then(node => {
      if (!node) {
        return customErrors.rejectWithObjectNotFoundError('Node is not found');
      }
      return node;
    });
};

exports.createNode = data => {
  var filter = {
    symbol: (data.symbol || '').toLowerCase()
  };
  
  return Node
    .count(filter)
    .then(cnt => {
      if (cnt > 0) {
        return customErrors.rejectWithDuplicateObjectError('This label is already in use');
      }
      return Node.create(data);
    });
};

exports.saveNode = node => {
  return node.save();
};

exports.deleteNode = node => {
  return node.remove();
};

exports.deleteAllNode = node => {
    return Node.remove({});
  };
  
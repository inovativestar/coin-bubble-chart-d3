'use strict';

var _              = require('lodash');
var Promise        = require('bluebird');
var customErrors   = require('n-custom-errors');
var consts         = require('../consts');
var nodesSrvc      = require('../data-services/node');
var validationUtil = require('../util/validations');

exports.find = function(req, res, next) {
  nodesSrvc
    .getNode({}, 'label parent isLeaf symbol children data volumeUsd24Hr marketCapUsd description')
    .then(
      hierarchyData => res.send(hierarchyData)
    )
    .catch(next);
};

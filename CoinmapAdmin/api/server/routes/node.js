'use strict';

var config  = require('../../config/environment');
var node    = require('../controllers/node');
var apiVer = config.get('api:version');

module.exports = app => {
  app.get(`/api/${apiVer}/node`, node.find);

};

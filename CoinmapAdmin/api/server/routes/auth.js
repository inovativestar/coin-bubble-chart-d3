'use strict';

var config  = require('../../config/environment');
var auth    = require('../controllers/auth');

var apiVer = config.get('api:version');

module.exports = app => {
  app.post(`/api/${apiVer}/auth/login`, auth.login);
};

'use strict';

var config  = require('../../config/environment');
var user    = require('../controllers/user');
var auth   = require('../middleware/auth');
var apiVer = config.get('api:version');

module.exports = app => {
  app.post(`/api/${apiVer}/user/changePassword`, auth.requireRolesWrapper('admin'), user.changePassword);
};

'use strict';

var config  = require('../../config/environment');
var hierarchy    = require('../controllers/hierarchy');
var auth   = require('../middleware/auth');
var apiVer = config.get('api:version');

module.exports = app => {
  app.put(`/api/${apiVer}/hierarchy`, auth.requireRolesWrapper('admin'), hierarchy.create);
  app.post(`/api/${apiVer}/hierarchy/:_id`, auth.requireRolesWrapper('admin'), hierarchy.update);
  app.get(`/api/${apiVer}/hierarchy`, auth.requireRolesWrapper('admin'), hierarchy.find);
  app.get(`/api/${apiVer}/hierarchyById/:_id`, auth.requireRolesWrapper('admin'), hierarchy.findById);
  app.get(`/api/${apiVer}/hierarchy/:_symbol`, auth.requireRolesWrapper('admin'), hierarchy.findBySymbol);
  app.delete(`/api/${apiVer}/hierarchy/:_id`, auth.requireRolesWrapper('admin'), hierarchy.delete);
};

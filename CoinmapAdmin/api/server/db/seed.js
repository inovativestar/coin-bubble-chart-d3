'use strict';

/* jshint maxlen: false */
/* jshint quotmark: false */
/* jshint newcap: false */

var _                    = require('lodash');
var mongoose             = require('mongoose');
var db                   = require('./');
var log                  = require('../util/logger').logger;
var User                 = mongoose.model('user');
var Hierarchy                 = mongoose.model('hierarchy');
var ObjectId             = mongoose.Types.ObjectId;
var hierarchySrvc      = require('../data-services/hierarchy');

function clearDb() {
  var ops = _(mongoose.models)
    .keys()
    .map(modelName => mongoose.model(modelName).remove())
    .value();

  return Promise.all(ops);
}

function insertUsers() {
  var user = [
    {"firstName" : "admin", "email" : "admin@mail.com", "password": "123456",  "active" : true, "provider" : "local", "role" : "admin" },
  ];
  return User.create(user);
}
function insertHierarchyRoot() {
  var hierarchyNodes = [
    {"label": "Root", "symbol": "root", "isLeaf": false}
  ];
  return Hierarchy.create(hierarchyNodes);
}

db
  .connect()
  .then(clearDb)
  .then(insertUsers)
  .then(insertHierarchyRoot)
  .then(() => log.info('All scripts applied succesfully'))
  .then(()=>db.disconnect())
  .catch(err => log.error('The scripts are not applied', err))


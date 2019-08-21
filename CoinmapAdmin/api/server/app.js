'use strict';

var express = require('express');
var config  = require('../config/environment');
var db      = require('./db');
var log     = require('./util/logger').logger;
var Service = require('./service/coinCampService');
require('./util/errors');

var app = express();
require('./express')(app);
require('./routes')(app);
require('./auth/strategies')();
require('./util/promisify');
  
if (app.get('env') !== 'test') {
  db.connect();

  var server = app.listen(app.get('port'), function() {
    log.info('Express server started', 'environment=' + config.get('env'), 'listening on port=' + config.get('port'));
  });
  var service = new Service({interval:30000});
  service.run();
}

module.exports = app;

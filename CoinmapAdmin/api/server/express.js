'use strict';

var bodyParser   = require('body-parser');
var passport     = require('passport');
var config       = require('../config/environment');
var log          = require('./util/logger');
var cors         = require('cors');
module.exports = function(app) {
  app.set('port', config.get('port'));

  if (process.env.NODE_ENV !== 'test') {
    app.use(log.common);
  }
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cors({
    origin: '*',
    credentials: true
  }));

};

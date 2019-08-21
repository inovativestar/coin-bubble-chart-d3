'use strict';

var mongoose   = require('mongoose');
var requireDir = require('require-dir');
var config     = require('../../config/environment');

mongoose.models = {};

requireDir('./models');

exports.connect = function() {
   return mongoose.connect(config.get('db'), { useNewUrlParser: true, useCreateIndex: true, }).then(() => {
        console.log('Connected to MongoDB.');
        Promise.resolve();
      }, (err) => {
        console.log(err);
        Promise.reject();
      });
     
};

exports.disconnect = function() {
  mongoose.connection.close();
    
};


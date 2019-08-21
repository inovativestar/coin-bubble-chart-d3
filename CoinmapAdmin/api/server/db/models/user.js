'use strict';

var mongoose     = require('mongoose');
var timestamps   = require('./../plugins/timestamps');
var consts       = require('../../consts');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  role: {
    type: String,
    required: true,
    enum: consts.USER.ROLES,
    default: 'admin'
  },

  active: {
    type: Boolean,
    required: true,
    default: true
  },

  provider: {
    type: String,
    default: 'local'
  },
  hashedPassword: String,
  salt: String,
});


userSchema.plugin(timestamps, { index: true });
require('./user-middleware')(userSchema);
module.exports = mongoose.model('user', userSchema);

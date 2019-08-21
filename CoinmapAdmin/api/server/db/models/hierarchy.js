'use strict';

var mongoose = require('mongoose');
var timestamps = require('./../plugins/timestamps');
var consts = require('../../consts');

var hierarchySchema = new mongoose.Schema({
  label: String,
  symbol: String,
  description: String,
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: 'hierarchy',
  },
  isLeaf: Boolean,
  children: [{
    type: mongoose.Schema.ObjectId,
    ref: 'hierarchy',
  }],
});

hierarchySchema.plugin(timestamps, { index: true });
module.exports = mongoose.model('hierarchy', hierarchySchema);

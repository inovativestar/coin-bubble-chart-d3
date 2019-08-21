'use strict';

var mongoose     = require('mongoose');
var timestamps   = require('./../plugins/timestamps');
var consts       = require('../../consts');

var coinSchema = new mongoose.Schema({
  changePercent24Hr: String,
  id: String,
  marketCapUsd: String,
  maxSupply: String,
  name: String,
  priceUsd: String,
  rank: String,
  supply: String,
  symbol: String,
  volumeUsd24Hr: String,
  vwap24Hr: String
});


var nodeSchema = new mongoose.Schema({
  symbol: String,
  label: String,
  parent: String,
  description: String,
  marketCapUsd: Number,
  volumeUsd24Hr: Number,
  isLeaf: Boolean,
  data: coinSchema,
  children: [{
    isLeaf : Boolean,
    symbol : String
  }],
});

nodeSchema.plugin(timestamps, { index: true });
module.exports = mongoose.model('node', nodeSchema);

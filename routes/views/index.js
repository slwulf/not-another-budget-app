var express = require('express');
var router = express.Router();

var transactions = require('./transactions');
var budgets = require('./budgets');

module.exports = {
  transactions: transactions,
  budgets: budgets
};

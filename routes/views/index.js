var express = require('express');
var router = express.Router();

var transactions = require('./transactions');
var budgets = require('./budgets');

router.use('/', transactions);
router.use('/budgets', budgets);

module.exports = router;

var express = require('express');
var router = express.Router();

var api = require('./api');
var views = require('./views');

// home
router.use('/', views.transactions);

// heads
router.use('/api', api);
router.use('/budgets', views.budgets);

module.exports = router;

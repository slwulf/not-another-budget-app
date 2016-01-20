var express = require('express');
var router = express.Router();

var api = require('./api');
// var views = require('./views');

// home
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// heads
router.use('/api', api);
// router.use('/transactions', views.transactions);
// router.use('/budgets', views.budgets);

module.exports = router;

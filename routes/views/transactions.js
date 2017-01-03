var express = require('express');
var router = express.Router();
var transactions = require('../../controllers/transactions');
var moment = require('moment');

router.get('/', render);
router.get('/date/:year/:month', render);
router.get('/date/:year/:month/:category', render);

router.get('/categories', categories);
router.get('/import', function(req, res, next) {
  res.render('import', { viewName: 'import' });
});

module.exports = router;

function render(req, res, next) {
  var year = req.params.year;
  var month = req.params.month;
  var category = req.params.category;

  transactions.view({year, month}, category)
    .then(function(view) {
      res.render('index', view);
    }).catch(next);
}

function categories(req, res, next) {
  var now = moment('2016-06-01');
  var startDate = now.clone().startOf('month');
  var endDate = now.clone().endOf('month');

  transactions.totals(startDate.toDate(), endDate.toDate())
    .then(function(totals) {
      res.render('categories', {
        viewName: 'categories',
        totals: totals
      });
    }).catch(next);
}

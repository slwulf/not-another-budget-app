var express = require('express');
var router = express.Router();
var transactions = require('../../controllers/transactions');
var moment = require('moment');

router.get('/', render);
router.get('/date/:year/:month', render);
router.get('/date/:year/:month/:category', render);

router.get('/categories', categories);
router.get('/categories/:start_date/:end_date', categories);
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
  var start = req.params.start_date || new Date();
  var end = req.params.end_date || new Date();
  var startDate = moment(start).startOf('month');
  var endDate = moment(end).endOf('month');

  transactions.totals(startDate.toDate(), endDate.toDate())
    .then(function(totals) {
      res.render('categories', {
        viewName: 'categories',
        totals: totals
      });
    }).catch(next);
}

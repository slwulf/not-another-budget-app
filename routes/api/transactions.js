var express = require('express');
var router = express.Router();
var transactions = require('../../controllers/transactions');
var importCSV = require('../../config/import');
var moment = require('moment');

/**
 * GET
 */

// static
router.get('/', transactions.get);
router.get('/categories', function(req, res, next) {
  transactions.categories(res.send, next);
});

// variable
router.get('/:category', transactions.get);
router.get('/:year/:month', transactions.get);
router.get('/totals/:start_date/:end_date',
  function(req, res, next) {
    var startDate = moment(req.params.start_date).toDate();
    var endDate = moment(req.params.end_date).toDate();

    transactions.totals(startDate, endDate)
      .then(function(results) {
        return results.sort(function(a, b) {
          var monthA = a._id.month;
          var monthB = b._id.month;
          var yearA = a._id.year;
          var yearB = b._id.year;
          return monthA - monthB || yearA - yearB;
        });
      }).then(function(results) {
        var tmp = results.reduce(function(totals, t) {
          var id = t._id;
          var category = id.category;
          var amount = parseFloat(t.total.toFixed(2));
          var year = id.year;
          var month = id.month < 10 ? '0' + id.month : id.month;
          var date = moment(year + '-' + month).format('MMM YYYY');

          totals[date] = totals[date] || [];
          totals[date].push({
            category: category,
            amount: Math.abs(amount)
          });

          totals[date].sort((a, b) => a.category.localeCompare(b.category));

          return totals;
        }, {});

        return tmp;
      })
      .then(x => {console.log(x); res.send(x);});
  });

/**
 * POST
 */

router.post('/new', transactions.post);
router.post('/import', function(req, res, next) {
  var csv = req.body.csv;
  importCSV(csv, function() {
    res.redirect('/');
  }, next);
});

/**
 * PUT
 */

router.put('/update', transactions.put);

/**
 * DELETE
 */

router.delete('/delete/:id', transactions.remove);

module.exports = router;

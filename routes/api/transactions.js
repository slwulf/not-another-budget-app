var express = require('express');
var router = express.Router();
var transactions = require('../../controllers/transactions');
var importCSV = require('../../config/import');

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
router.get('/:year/:month/:category', transactions.get);

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

var express = require('express');
var router = express.Router();
var transactions = require('../../controllers/transactions');

/**
 * GET
 */

// static
router.get('/', transactions.get);
router.get('/categories', transactions.categories);

// variable
router.get('/:category', transactions.get);
router.get('/:year/:month', transactions.get);
router.get('/:year/:month/:category', transactions.get)

/**
 * POST
 */

// router.post('/import', transactions.importCSV);

module.exports = router;

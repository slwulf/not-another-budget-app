var express = require('express');
var router = express.Router();
var transactions = require('../../controllers/transactions');

router.get('/', transactions.get);
router.get('/:category', transactions.get);
router.get('/:year/:month', transactions.get);
router.get('/:year/:month/:category', transactions.get)

router.post('/import', transactions.importCSV);

module.exports = router;

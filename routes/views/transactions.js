var express = require('express');
var router = express.Router();
var transactions = require('../../controllers/transactions');

router.get('/', transactions.render);

module.exports = router;

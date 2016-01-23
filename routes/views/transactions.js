var express = require('express');
var router = express.Router();
var transactions = require('../../controllers/transactions');

router.get('/', transactions.render);
router.get('/cat/:category', transactions.render);
router.get('/date/:year/:month', transactions.render);
router.get('/date/:year/:month/:category', transactions.render);
router.get('/import', function(req, res, next) {
  res.render('import');
});

module.exports = router;

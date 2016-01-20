var express = require('express');
var router = express.Router();
var budgets = require('../controllers/budgets');

router.get('/', budgets.get);
router.get('/:category', budgets.get);
router.get('/:category/status', budgets.status);

module.exports = router;

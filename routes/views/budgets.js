var express = require('express');
var router = express.Router();
var budgets = require('../../controllers/budgets');

router.get('/', budgets.render);
router.get('/date/:year/:month', budgets.render);

module.exports = router;

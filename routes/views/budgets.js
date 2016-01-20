var express = require('express');
var router = express.Router();
var budgets = require('../../controllers/budgets');

router.get('/', budgets.render);

module.exports = router;

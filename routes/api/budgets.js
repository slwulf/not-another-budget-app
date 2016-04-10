var express = require('express');
var router = express.Router();
var budgets = require('../../controllers/budgets');

router.get('/', budgets.get);
router.get('/:category', budgets.get);
router.get('/:category/status', budgets.status);

router.post('/new', budgets.post);

router.put('/update', budgets.put);

router.delete('/delete/:id', budgets.remove);

module.exports = router;

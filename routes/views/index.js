const express = require('express')
const router = express.Router()

const transactions = require('./transactions')
const budgets = require('./budgets')

router.use('/', transactions)
router.use('/budgets', budgets)

module.exports = router

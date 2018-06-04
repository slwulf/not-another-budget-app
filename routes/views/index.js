const path = require('path')
const express = require('express')
const router = express.Router()

const transactions = require('./transactions')
const budgets = require('./budgets')

router.use('/', transactions)
router.use('/budgets', budgets)
router.get('/react', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'))
})

module.exports = router

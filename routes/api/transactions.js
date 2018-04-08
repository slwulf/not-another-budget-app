const express = require('express')
const router = express.Router()
const transactions = require('../../controllers/transactions')
const importData = require('../../config/import')
const moment = require('moment')

router.get('/', get)
router.get('/:category', get)
router.post('/new', post)
router.put('/update', put)
router.delete('/delete/:id', remove)

router.get('/totals/:start_date/:end_date', getTotals)
router.post('/import', importTransactions)

module.exports = router

function get(req, res, next) {
  transactions.get(req.params.category)
    .then(results => res.send(results))
    .catch(next)
}

function post(req, res, next) {
  transactions.create(req.body)
    .then(() => res.redirect('/'))
    .catch(next)
}

function put(req, res, next) {
  transactions.edit(req.body)
    .then(transaction => res.send(transaction))
    .catch(next)
}

function remove(req, res, next) {
  const id = req.params.id
  transactions.remove(id)
    .then(() => res.send({
      status: 200,
      message: 'Successfully removed transaction' + id
    }))
    .catch(next)
}

function getTotals(req, res, next) {
  const startDate = moment(req.params.start_date).toDate()
  const endDate = moment(req.params.end_date).toDate()

  transactions.totals(startDate, endDate)
    .then(res.send)
    .catch(next)
}

function importTransactions(req, res, next) {
  const separator = req.body.separator
  const data = req.body.data

  importData(separator, data)
    .catch(next)
    .then(() => res.redirect('/'))
}

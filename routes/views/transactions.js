const express = require('express')
const router = express.Router()
const transactions = require('../../controllers/transactions')
const moment = require('moment')

router.get('/', render)
router.get('/date/:year/:month', render)
router.get('/date/:year/:month/:category', render)

router.get('/categories', categories)
router.get('/categories/:start_date/:end_date', categories)
router.get('/import', function(req, res, next) {
  res.render('import', { viewName: 'import' })
})

module.exports = router

function render(req, res, next) {
  const year = req.params.year
  const month = req.params.month
  const category = req.params.category

  transactions.view({year, month}, category)
    .then(function(view) {
      res.render('index', view)
    }).catch(next)
}

function categories(req, res, next) {
  const start = req.params.start_date || new Date()
  const end = req.params.end_date || new Date()
  const startDate = moment(start).startOf('month')
  const endDate = moment(end).endOf('month')

  if (!req.params.start_date) startDate = startDate.subtract(1, 'months')

  transactions.totals(startDate.toDate(), endDate.toDate())
    .then(function(totals) {
      res.render('categories', {
        viewName: 'categories',
        totals: totals,
        startDate: startDate.format('YYYY/MM'),
        endDate: endDate.format('YYYY/MM')
      })
    }).catch(next)
}

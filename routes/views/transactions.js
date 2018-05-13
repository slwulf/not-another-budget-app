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
    .then(view => res.render('index', view))
    .catch(next)
}

function categories(req, res, next) {
  const end = moment(req.params.end_date).endOf('month')
  const start = req.params.start_date
    ? moment(req.params.start_date).startOf('month')
    : moment().startOf('month').subtract(1, 'months')

  transactions.totals(start.toDate(), end.toDate())
    .then(totals => res.render('categories', {
      viewName: 'categories',
      totals: totals,
      startDate: start.format('YYYY/MM'),
      endDate: end.format('YYYY/MM')
    }))
    .catch(next)
}

const express = require('express')
const router = express.Router()
const budgets = require('../../controllers/budgets')

router.get('/', render)
router.get('/date/:year/:month', render)

module.exports = router

function render(req, res, next) {
  const year = req.params.year
  const month = req.params.month

  budgets.view({year, month})
    .then(function(view) {
      res.render('budgets', view)
    }).catch(next)
}

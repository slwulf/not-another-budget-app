var express = require('express')
var router = express.Router()
var budgets = require('../../controllers/budgets')

router.get('/', render)
router.get('/date/:year/:month', render)

module.exports = router

function render(req, res, next) {
  var year = req.params.year
  var month = req.params.month

  budgets.view({year, month})
    .then(function(view) {
      res.render('budgets', view)
    }).catch(next)
}

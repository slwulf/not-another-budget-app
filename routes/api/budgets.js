var express = require('express')
var router = express.Router()
var budgets = require('../../controllers/budgets')

router.get('/', get)
router.get('/:category', get)
router.post('/new', post)
router.put('/update', put)
router.delete('/delete/:id', remove)

module.exports = router

function get(req, res, next) {
  budgets.get(req.params.category)
    .then(function(results) {
      res.send(results)
    }).catch(next)
}

function post(req, res, next) {
  var name = req.body.name
  var amount = req.body.amount

  budgets.create(name, amount)
    .then(function() {
      res.redirect('/budgets')
    }).catch(next)
}

function put(req, res, next) {
  var id = req.body.id
  var amount = req.body.amount
  var category = req.body.category

  budgets.edit({id, amount, category})
    .then(function(budget) {
      res.send(budget)
    }).catch(next)
}

function remove(req, res, next) {
  var id = req.params.id

  budgets.remove(id)
    .then(function() {
      res.send({
        status: 200,
        message: 'Successfully removed budget ' + id
      })
    }).catch(next)
}

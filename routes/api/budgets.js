const express = require('express')
const router = express.Router()
const budgets = require('../../controllers/budgets')

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
  const name = req.body.name
  const amount = req.body.amount

  budgets.create(name, amount)
    .then(function() {
      res.redirect('/budgets')
    }).catch(next)
}

function put(req, res, next) {
  const id = req.body.id
  const amount = req.body.amount
  const category = req.body.category

  budgets.edit({id, amount, category})
    .then(function(budget) {
      res.send(budget)
    }).catch(next)
}

function remove(req, res, next) {
  const id = req.params.id

  budgets.remove(id)
    .then(function() {
      res.send({
        status: 200,
        message: 'Successfully removed budget ' + id
      })
    }).catch(next)
}

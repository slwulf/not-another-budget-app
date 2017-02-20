var express = require('express');
var router = express.Router();
var transactions = require('../../controllers/transactions');
var importData = require('../../config/import');
var moment = require('moment');

router.get('/', get);
router.get('/:category', get);
router.post('/new', post);
router.put('/update', put);
router.delete('/delete/:id', remove);

router.get('/totals/:start_date/:end_date', getTotals);
router.post('/import', importTransactions);

module.exports = router;

function get(req, res, next) {
  transactions.get(req.params.category)
    .then(function(results) {
      res.send(results);
    }).catch(next);
}

function post(req, res, next) {
  transactions.create(req.body)
    .then(function() {
      res.redirect('/');
    }).catch(next);
}

function put(req, res, next) {
  transactions.edit(req.body)
    .then(function(transaction) {
      res.send(transaction);
    }).catch(next);
}

function remove(req, res, next) {
  var id = req.params.id
  transactions.remove(id)
    .then(function() {
      res.send({
        status: 200,
        message: 'Successfully removed transaction' + id
      });
    }).catch(next);
}

function getTotals(req, res, next) {
  var startDate = moment(req.params.start_date).toDate();
  var endDate = moment(req.params.end_date).toDate();

  transactions.totals(startDate, endDate)
    .then(res.send)
    .catch(next);
}

function importTransactions(req, res, next) {
  var separator = req.body.separator;
  var data = req.body.data;

  importData(separator, data)
    .catch(next)
    .then(function() {
      res.redirect('/');
    });
}

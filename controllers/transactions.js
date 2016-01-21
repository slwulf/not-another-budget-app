var db = require('mongoose');
var numeral = require('numeral');

/**
 * get
 *
 * Returns a list of all transactions
 * optionally filtering by category
 * or date.
 */

var get = function get(req, res, next) {
  var t = db.model('transactions').find();
  var category = req.params.category;
  var year = req.params.year;
  var month = req.params.month;

  if (category) t = t.where({ category: category });
  // if (year) {
  //   t = t.where({  });
  // }

  t.exec(function(err, list) {
    if (err) next(err);
    res.send(list);
  });
};

/**
 * post
 *
 * Creates a new transaction given
 * some data.
 */

var post = function post(req, res, next) {
  var description = req.body.description || 'Transaction';
  var amount = req.body.amount || 0;
  var category = req.body.category || 'Default';
  var date = req.body.date || new Date();

  db.model('transactions').create({
    description: description,
    amount: amount,
    category: category,
    date: date
  }, function(err) {
    if (err) next(err);
    res.redirect('/');
  });
};

/**
 * put
 *
 * Updates a specific transaction
 * given some data and an id.
 */

var put = function put(req, res, next) {
  var id = req.body.id;
  var description = req.body.id;
  var amount = req.body.amount;
  var category = req.body.category;
  var date = req.body.date;

  db.model('transactions').findById(id, function(err, tr) {
    if (err) next(err);

    if (description) tr.description = description.trim();
    if (amount) tr.amount = parseFloat(amount);
    if (category) tr.category = category.trim();
    if (date) tr.date = new Date(date);

    tr.save(function(err) {
      if (err) next(err);
      res.send(tr);
    });
  });
};

/**
 * remove
 *
 * Deletes a specific transaction
 * given an id.
 */

var remove = function remove(req, res, next) {
  db.model('transactions').findByIdAndRemove(req.body.id, function(err) {
    if (err) next(err);
  });
};

/**
 * categories
 *
 * Returns a list of all distinct
 * categories of transactions.
 */

var categories = function categories(cb, next) {
  var t = db.model('transactions').find();
  t.distinct('category');
  t.exec(function(err, list) {
    if (err) next(err);
    cb(list);
  });
};

/**
 * render
 *
 * Renders the view for transactions.
 */

var render = function render(req, res, next) {
  db.model('transactions').find(function(err, list) {
    if (err) next(err);
    res.render('index', {
      title: 'Not Another Budget App',
      transactions: list
    });
  });
};

module.exports = {
  get: get,
  post: post,
  put: put,
  remove: remove,
  categories: categories,
  render: render
};

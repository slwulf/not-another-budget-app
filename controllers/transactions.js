var db = require('mongoose');
var numeral = require('numeral');
var moment = require('moment');

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
  var description = req.body.description;
  var amount = req.body.amount;
  var category = req.body.category;
  var date = req.body.date;

  db.model('transactions').findById(id, function(err, tr) {
    if (err) next(err);

    if (description) tr.description = description.trim();
    if (amount) tr.amount = parseFloat(amount.replace('$', ''));
    if (category) tr.category = category.trim();
    if (date) tr.date = new Date(date);

    tr.save(function(err) {
      if (err) next(err);
      tr.amount = numeral(tr.amount).format('$0,0.00');
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
 * By default, renders transactions for current month.
 * Can also render by category and/or year + month.
 */

var render = function render(req, res, next) {
  var category = req.params.category;
  var year = req.params.year;
  var month = req.params.month;

  var date = month ? moment().set({ year: year, month: month }) : moment();
  var dateMin = date.clone().startOf('month');
  var dateMax = date.clone().endOf('month');

  var transactions = db.model('transactions')
    .find()
    .where('date')
      .gte(dateMin.toDate())
      .lte(dateMax.toDate());

  if (category) {
    transactions = transactions
      .where('category')
      .equals(category);
  }

  transactions.exec(function(err, list) {
    if (err) next(err);

    // sort by date
    var sorted = list.sort(function(a, b) {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    }).reverse();

    // total all amounts
    var total = list.reduce(function(sum, t) {
      return sum += t.amount;
    }, 0);

    // total income
    var totalIn = list.reduce(function(sum, t) {
      if (t.amount > 0) return sum += t.amount;
      return sum;
    }, 0);

    // total expenses
    var totalOut = list.reduce(function(sum, t) {
      if (t.amount < 0) return sum += t.amount;
      return sum;
    }, 0);

    res.render('index', {
      viewName: 'transactions',
      transactions: sorted,
      totals: {
        all: total,
        income: totalIn,
        expenses: totalOut
      },
      category: category || '',
      date: date.format('MMMM YYYY')
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

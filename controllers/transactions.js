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
    if (amount) tr.amount = parseFloat(amount.replace(/\$\,/g, ''));
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
  db.model('transactions').findByIdAndRemove(req.params.id, function(err) {
    if (err) next(err);
    res.send({ status: 200, message: 'Successfully removed transaction ' + req.params.id });
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
 * isCategory
 *
 * Given a category and an object,
 * returns boolean of object.category
 * and category. Curried.
 *
 * @param {String} category The category to check
 * @param {Object} obj The object to check
 */

function isCategory(category) {
  return function(obj) {
    return category === obj.category;
  };
}

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
  var currentDate = {
    year: parseInt(year, 10),
    month: parseInt(month, 10) - 1
  };

  var date = month && year ? moment().set(currentDate) : moment();
  var dateMin = date.clone().startOf('month');
  var dateMax = date.clone().endOf('month');

  var transactions = db.model('transactions')
    .find()
    .where('date')
      .gte(dateMin.toDate())
      .lte(dateMax.toDate());

  // if (category) {
  //   transactions = transactions
  //     .where('category')
  //     .equals(category);
  // }

  transactions.exec(function(err, list) {
    if (err) next(err);

    // sort by date
    var sorted = list.sort(function(a, b) {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    }).reverse();

    // filter by category
    if (category) sorted = sorted.filter(isCategory(category));

    // get all unique categories
    var categories = list.map(function(t) {
      return t.category;
    }).filter(function(t, i, arr) {
      return arr.indexOf(t) === i;
    }).sort();

    // total all amounts
    var total = sorted.reduce(function(sum, t) {
      return sum += t.amount;
    }, 0);

    // total income
    var totalIn = sorted.reduce(function(sum, t) {
      if (t.amount > 0) return sum += t.amount;
      return sum;
    }, 0);

    // total expenses
    var totalOut = sorted.reduce(function(sum, t) {
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
      categories: categories,
      date: date.format('MMMM YYYY'),
      currentDate: {
        month: date.format('MM'),
        year: date.format('YYYY')
      }
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

var db = require('mongoose');

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
 * categories
 *
 * Returns a list of all distinct
 * categories of transactions.
 */

var categories = function categories(req, res, next) {
  var t = db.model('transactions').find();
  t.distinct('category');
  t.exec(function(err, list) {
    if (err) next(err);
    res.send(list);
  });
}

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
  })
};

module.exports = {
  get: get,
  categories: categories,
  render: render
};

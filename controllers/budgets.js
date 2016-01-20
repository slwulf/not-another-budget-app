var db = require('mongoose');

/**
 * status
 *
 * Determines whether a given category
 * of transaction is on budget.
 */

var status = function status(req, res, next) {
  var t = db.model('transactions').find();
  var b = db.model('budgets').findOne();
  var category = { category: req.params.category };

  t = t.where(category);
  b = b.where(category);

  // first, get transactions
  t.exec(function(err, list) {
    if (err) next(err);

    // count up total
    var total = list.reduce(function(sum, t) {
      return sum + t.amount;
    }, 0);

    // next, get budget
    b.exec(function(err, budget) {
      if (err) next(err);

      var amt = budget.amount;
      var isOver = (total > amt);
      var diff = Math.abs(total - amt);

      res.send({
        budget: budget,
        isOver: isOver,
        difference: diff
      });
    });
  });
};

/**
 * get
 *
 * Returns a list of all budgets or
 * a specific budget given a category name.
 */

var get = function get(req, res, next) {
  var b = db.model('budgets').find();
  var category = req.params.category;

  if (category) b = b.where({ category: category });

  b.exec(function(err, list) {
    if (err) next(err);
    res.send(list);
  });
};

/**
 * render
 *
 * Renders the view for budgets.
 */

var render = function render(req, res, next) {
  db.model('budgets').find(function(err, list) {
    if (err) next(err);
    res.render('index', {
      title: 'Not Another Budget App',
      budgets: list
    });
  })
};

module.exports = {
  get: get,
  status: status,
  render: render
};

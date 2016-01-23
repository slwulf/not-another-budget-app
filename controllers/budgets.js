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
 * statusAll
 *
 * Returns a list of all budgets
 * including the status of each.
 */

var statusAll = function statusAll(cb, errorHandler) {
  var t = db.model('transactions').find();
  var b = db.model('budgets').find();

  // first, get transactions
  t.exec(function(err, list) {
    if (err) errorHandler(err);

    // get totals by category
    var totals = list.reduce(function(obj, l) {
      var prev = obj[l.category] || 0;
      obj[l.category] = prev + l.amount;
      return obj;
    }, {});

    // next, get budgets
    b.exec(function(err, budgets) {
      if (err) errorHandler(err);

      // build array of budget objects
      var resp = budgets.map(function(x) {
        var cat = x.category;
        var amt = x.amount;
        var total = totals[cat];

        return {
          category: cat,
          amount: amt,
          totalSpent: total,
          isOver: (total > amt)
        };
      });

      cb(resp);
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
  statusAll(function(budgets) {
    res.render('budgets', {
      budgets: budgets
    });
  }, next);
};

module.exports = {
  get: get,
  status: status,
  render: render
};

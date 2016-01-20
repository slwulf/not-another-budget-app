var mongoose = require('mongoose');

/**
 * onBudget
 *
 * Determines whether a given category
 * of transaction is on budget.
 */

var onBudget = function onBudget(req, res, next) {
  var t = mongoose.model('transactions').find();
  var b = mongoose.model('budgets').findOne();
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
 * Returns a list of all budgets.
 */

var get = function get(req, res, next) {
  var b = mongoose.model('budgets').find();
  var category = req.params.category;

  if (category) b = b.where({ category: category });

  b.exec(function(err, list) {
    if (err) next(err);
    res.send(list);
  });
};

module.exports = {
  get: get,
  status: onBudget
};

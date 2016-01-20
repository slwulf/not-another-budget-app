var mongoose = require('mongoose');

/**
 * get
 *
 * Returns a list of all transactions
 * optionally filtering by category
 * or date.
 */

var get = function(req, res, next) {
  var t = mongoose.model('transactions').find();
  var category = req.params.category;
  var year = req.params.year;
  var month = req.params.month;

  if (category) t = t.where({ category: category });
  if (year) {
    t = t.where({  });
  }

  t.exec(function(err, list) {
    if (err) {
      next(err);
    } else {
      res.send(list);
    }
  });
};

module.exports = {
  get: get
};

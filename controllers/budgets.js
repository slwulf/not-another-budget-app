var db = require('mongoose');
var numeral = require('numeral');
var moment = require('moment');

module.exports = {
  get: getBudgets,
  create: createBudget,
  edit: editBudget,
  remove: removeBudget,
  view: view
};

function getBudgets(category) {
  return new Promise(function(resolve, reject) {
    var budgets = db.model('budgets').find();
    if (category) budgets = budgets.where({category});

    budgets.exec(function(err, results) {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

function createBudget(name = 'Default', amount = 0) {
  return new Promise(function(resolve, reject) {
    db.model('budgets').create({
      amount: amount,
      category: name
    }, function(err) {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

function editBudget(budget) {
  var amount = budget.amount;
  var category = budget.category;

  return new Promise(function(resolve, reject) {
    db.model('budgets')
      .findById(budget.id, function(err, b) {
        if (err) return reject(err);
        if (amount) b.amount = parseFloat(amount.replace(/\$|\,/g, ''));
        if (category) b.category = category.trim();

        b.save(function(err) {
          if (err) return reject(err);
          b.amount = numeral(b.amount).format('$0,0.00');
          resolve(b);
        });
      });
  });
}

function removeBudget(id) {
  return new Promise(function(resolve, reject) {
    db.model('budgets')
      .findByIdAndRemove(id, function(err) {
        if (err) reject(err);
        else resolve(true);
      });
  });
}

function view(date) {
  var now = moment();
  var year = date.year ? parseInt(date.year, 10) : now.year();
  var month = date.month ? parseInt(date.month, 10) : now.month();
  var displayDate = moment().set({ year, month });
  var dateMin = displayDate.clone().startOf('month');
  var dateMax = displayDate.clone().endOf('month');

  return new Promise(function(resolve, reject) {
    var budgets = db.model('budgets').find();
    var transactions = db.model('transactions').find({
      date: { $gte: dateMin.toDate(), $lte: dateMax.toDate() }
    });

    transactions.exec(function(err, ts) {
      if (err) return reject(err);

      var categoryTotals = ts.reduce(function(o, t) {
        o[t.category] = o[t.category] || 0;
        o[t.category] += t.amount;
        return o;
      }, {});

      budgets.exec(function(err, bs) {
        if (err) return reject(err);

        var viewBudgets = bs.map(function(b) {
          var total = Math.abs(categoryTotals[b.category]) || 0;
          return {
            _id: b._id,
            category: b.category,
            amount: b.amount,
            totalSpent: total,
            remainder: (b.amount - total),
            isOver: (total > b.amount)
          };
        }).sort((a, b) => {
          var catA = a.category.toLowerCase();
          var catB = b.category.toLowerCase();
          if (catA < catB) return -1;
          if (catA > catB) return 1;
          return 0;
        });

        var totalBudget = bs.reduce((sum, b) => sum += b.amount, 0);
        var totalSpent = ts.reduce((sum, t) => t.amount > 0 ? sum : sum += t.amount, 0);

        var viewTotals = {
          budget: totalBudget,
          spent: totalSpent,
          remainder: (totalBudget + totalSpent)
        };

        var existingBudgets = bs.map(b => b.category);
        var neededBudgets = Object.keys(categoryTotals)
          .filter(c => existingBudgets.indexOf(c) === -1)
          .sort();

        resolve({
          viewName: 'budgets',
          budgets: viewBudgets,
          totals: viewTotals,
          categories: neededBudgets,
          date: displayDate.format('MMMM YYYY'),
          currentDate: {
            month: displayDate.format('MM'),
            year: displayDate.format('YYYY')
          }
        });
      });
    });
  });
}

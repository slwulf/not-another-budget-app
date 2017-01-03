var db = require('mongoose');
var numeral = require('numeral');
var moment = require('moment');

module.exports = {
  get: getTransactions,
  create: createTransaction,
  edit: editTransaction,
  remove: removeTransaction,
  totals: categoryTotals,
  view: view
};

function getTransactions(category) {
  return new Promise(function(resolve, reject) {
    var transactions = db.model('transactions').find();
    if (category) transactions = transactions.where({category});

    transactions.exec(function(err, list) {
      if (err) reject(err);
      else resolve(list);
    });
  });
}

function createTransaction(data) {
  return new Promise(function(resolve, reject) {
    db.model('transactions').create({
      description: data.description || 'Transaction',
      amount: data.amount || 0,
      category: data.category || 'Default',
      date: data.date || new Date()
    }, function(err) {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

function editTransaction(data) {
  var description = data.description;
  var amount = data.amount;
  var category = data.category;
  var date = data.date;

  return new Promise(function(resolve, reject) {
    db.model('transactions').findById(data.id,
      function(err, t) {
        if (err) return reject(err);

        if (description) t.description = description.trim();
        if (amount) t.amount = parseFloat(amount.replace(/\$|\,/g, ''));
        if (category) t.category = category.trim();
        if (date) t.date = new Date(date);

        t.save(function(err) {
          if (err) return reject(err);
          t.amount = numeral(t.amount).format('$0,0.00');
          resolve(t);
        });
      });
  });
}

function removeTransaction(id) {
  return new Promise(function(resolve, reject) {
    db.model('transactions')
      .findByIdAndRemove(id, function(err) {
        if (err) reject(err);
        else resolve(true);
      });
  });
}

function categoryTotals(startDate, endDate) {
  return new Promise(function(resolve, reject) {
    db.model('transactions').aggregate([
      { $match: {
        date: { $gte: startDate, $lte: endDate }
      }},
      { $group: {
        _id: {
          category: '$category',
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        total: { $sum: '$amount' }
      }}
    ], function(err, results) {
      if (err) reject(err);
      else resolve(results);
    });
  }).then(function(results) {
    return results.sort(function(a, b) {
      var yearA = a._id.year;
      var yearB = b._id.year;
      var monthA = a._id.month;
      var monthB = b._id.month;
      return yearA - yearB || monthA - monthB;
    });
  }).then(function(results) {
    return results.reduce(function(totals, t) {
      var id = t._id;
      var category = id.category;
      var amount = parseFloat(t.total.toFixed(2));
      var year = id.year;
      var month = id.month < 10 ? '0' + id.month : id.month;
      var date = moment(year + '-' + month).format('MMM YYYY');

      totals[date] = totals[date] || [];
      totals[date].push({
        category: category,
        amount: Math.abs(amount)
      });

      totals[date].sort((a, b) => a.category.localeCompare(b.category));

      return totals;
    }, {});
  });
}

function isCategory(category) {
  return function(obj) {
    return category === obj.category;
  };
}

function view(date, category) {
  var year = parseInt(date.year, 10);
  var month = parseInt(date.month, 10) - 1;
  var queryDate = month && year ? moment().set({year, month}) : moment();
  var dateMin = queryDate.clone().startOf('month');
  var dateMax = queryDate.clone().endOf('month');

  return new Promise(function(resolve, reject) {
    db.model('transactions').find({
      date: { $gte: dateMin.toDate(), $lte: dateMax.toDate() }
    }).exec(function(err, list) {
      if (err) return reject(err);

      var transactions = list.sort(function(a, b) {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;
      }).reverse().filter(function(transaction) {
        if (category) return isCategory(category)(transaction);
        return true;
      });

      var categories = list.map(t => t.category)
        .filter((t, i, arr) => arr.indexOf(t) === i)
        .sort();

      var total = transactions.reduce((s, t) => s += t.amount, 0);
      var totalIn = transactions.reduce((s, t) => t.amount > 0 ? s += t.amount : s, 0);
      var totalOut = transactions.reduce((s, t) => t.amount < 0 ? s += t.amount : s, 0);

      resolve({
        viewName: 'transactions',
        transactions: transactions,
        totals: {
          all: total,
          income: totalIn,
          expenses: totalOut
        },
        category: category || '',
        categories: categories,
        date: queryDate.format('MMMM YYYY'),
        currentDate: {
          month: queryDate.format('MM'),
          year: queryDate.format('YYYY')
        }
      });
    });
  });
}

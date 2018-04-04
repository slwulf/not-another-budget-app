const db = require('mongoose')
const numeral = require('numeral')
const moment = require('moment')

module.exports = {
  get: getTransactions,
  create: createTransaction,
  edit: editTransaction,
  remove: removeTransaction,
  totals: categoryTotals,
  view: view
}

function getTransactions(category) {
  return new Promise(function(resolve, reject) {
    const transactions = db.model('transactions').find()
    if (category) transactions = transactions.where({category})

    transactions.exec(function(err, list) {
      if (err) reject(err)
      else resolve(list)
    })
  })
}

function createTransaction(data) {
  return new Promise(function(resolve, reject) {
    db.model('transactions').create({
      description: data.description || 'Transaction',
      amount: data.amount || 0,
      category: data.category || 'Default',
      date: data.date || new Date()
    }, function(err) {
      if (err) reject(err)
      else resolve(true)
    })
  })
}

function editTransaction(data) {
  const description = data.description
  const amount = data.amount
  const category = data.category
  const date = data.date

  return new Promise(function(resolve, reject) {
    db.model('transactions').findById(data.id,
      function(err, t) {
        if (err) return reject(err)

        if (description) t.description = description.trim()
        if (amount) t.amount = parseFloat(amount.replace(/\$|\,/g, ''))
        if (category) t.category = category.trim()
        if (date) t.date = new Date(date)

        t.save(function(err) {
          if (err) return reject(err)
          t.amount = numeral(t.amount).format('$0,0.00')
          resolve(t)
        })
      })
  })
}

function removeTransaction(id) {
  return new Promise(function(resolve, reject) {
    db.model('transactions')
      .findByIdAndRemove(id, function(err) {
        if (err) reject(err)
        else resolve(true)
      })
  })
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
      if (err) reject(err)
      else resolve(results)
    })
  }).then(function(results) {
    return results.sort(function(a, b) {
      const yearA = a._id.year
      const yearB = b._id.year
      const monthA = a._id.month
      const monthB = b._id.month
      return yearA - yearB || monthA - monthB
    })
  }).then(function(results) {
    const months = results.reduce(function(ms, m) {
      const id = m._id
      const year = id.year
      const month = id.month < 10 ? '0' + id.month : id.month
      const date = moment(year + '-' + month).format('MMM YYYY')

      if (ms.indexOf(date) === -1) ms.push(date)

      return ms
    }, [])

    return results.reduce(function(totals, t) {
      const id = t._id
      const category = id.category
      const amount = parseFloat(t.total.toFixed(2))
      const year = id.year
      const month = id.month < 10 ? '0' + id.month : id.month
      const date = moment(year + '-' + month).format('MMM YYYY')
      const index = months.indexOf(date)

      totals[category] = totals[category] || months.slice()
      totals[category][index] = {
        date: date,
        amount: Math.abs(amount)
      }

      return totals
    }, {})
  })
}

function isCategory(category) {
  return function(obj) {
    return category === obj.category
  }
}

function view(date, category) {
  const year = parseInt(date.year, 10)
  const month = parseInt(date.month, 10) - 1
  const queryDate = date.month && date.year ? moment().set({year, month}) : moment()
  const dateMin = queryDate.clone().startOf('month')
  const dateMax = queryDate.clone().endOf('month')

  return new Promise(function(resolve, reject) {
    db.model('transactions').find({
      date: { $gte: dateMin.toDate(), $lte: dateMax.toDate() }
    }).exec(function(err, list) {
      if (err) return reject(err)

      const transactions = list.sort(function(a, b) {
        if (a.date < b.date) return -1
        if (a.date > b.date) return 1
        return 0
      }).reverse().filter(function(transaction) {
        if (category) return isCategory(category)(transaction)
        return true
      })

      const categories = list.map(t => t.category)
        .filter((t, i, arr) => arr.indexOf(t) === i)
        .sort()

      const total = transactions.reduce((s, t) => s += t.amount, 0)
      const totalIn = transactions.reduce((s, t) => t.amount > 0 ? s += t.amount : s, 0)
      const totalOut = transactions.reduce((s, t) => t.amount < 0 ? s += t.amount : s, 0)

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
      })
    })
  })
}

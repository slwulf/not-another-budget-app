const {Transaction} = require('../models')
const db = require('mongoose')
const numeral = require('numeral')
const moment = require('moment')
const {pick} = require('ramda')

module.exports = {
  get: getTransactions,
  create: createTransaction,
  edit: editTransaction,
  remove: removeTransaction,
  totals: categoryTotals,
  view: view
}

function getTransactions(category) {
  const where = category ? {category} : {}
  return Transaction
    .findAll({ where })
    .then((records = []) => records.map(r => r.dataValues))
}

function createTransaction(data) {
  const keys = ['description', 'amount', 'category', 'date']
  const transaction = pick(keys, data)
  return Transaction
    .create(transaction)
    .then(record => record.dataValues)
}

async function editTransaction(data) {
  const {id, description, amount, category, date} = data
  const record = Transaction.findById(id)

  return record
    .update({
      description: description ? description.trim() : record.description,
      amount: amount ? parseFloat(amount.replace(/\$|\,/g, '')) : parseFloat(record.amount),
      category: category ? category.trim() : record.category,
      date: date ? new Date(date) : record.date
    }, { returning: true })
    .then(({dataValues}) => {
      dataValues.amount = numeral(dataValues.amount).format('$0,0.00')
    })
}

function removeTransaction(id) {
  return Transaction.destroy({ where: {id} })
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

function isCategory(cat) {
  return ({category}) => cat === category
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

const {Transaction} = require('../models')
const {Op} = require('sequelize')
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

async function view({month, year}, category = '') {
  const date = month && year
    ? moment().set({ year: Number(year), month: Number(month) - 1 })
    : moment()

  const min = date.clone().startOf('month')
  const max = date.clone().endOf('month')

  const [transactions, categories] = await (() => {
    return Promise.all([
      Transaction.findAll({
        where: {
          ...(category ? {category} : {}),
          date: { [Op.gte]: min, [Op.lte]: max }
        },
        order: [['date', 'DESC'], ['category', 'ASC']]
      }),
      Transaction.findAll({
        attributes: ['category'],
        group: 'category',
        order: [['category', 'ASC']]
      })
    ])
  })()

  const amounts = transactions.map(({amount}) => Number(amount) || 0)
  const total = amounts.reduce((sum, a) => sum + a, 0)
  const totalIn = amounts.reduce((sum, a) => a > 0 ? sum + a : sum, 0)
  const totalOut = amounts.reduce((sum, a) => a < 0 ? sum + a : sum, 0)

  return {
    viewName: 'transactions',
    transactions,
    totals: {
      all: total,
      income: totalIn,
      expenses: totalOut
    },
    category,
    categories: categories.map(({category}) => category),
    date: date.format('MMMM YYYY'),
    currentDate: {
      month: date.format('MM'),
      year: date.format('YYYY')
    }
  }
}

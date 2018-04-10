const {Transaction} = require('../models')
const {Op, literal} = require('sequelize')
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
  const record = await Transaction.findById(id)

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

async function categoryTotals(startDate, endDate) {
  const date = { [Op.gte]: startDate, [Op.lte]: endDate }
  const query = await Transaction.findAll({
    where: {date},
    attributes: [
      [literal('EXTRACT(month FROM date)'), 'month'],
      [literal('EXTRACT(year FROM date)'), 'year'],
      [literal('category'), 'category'],
      [literal('SUM(amount)'), 'total']
    ],
    group: [
      literal('category'),
      literal('year'),
      literal('month')
    ],
    order: [
      [literal('year'), 'ASC'],
      [literal('month'), 'ASC'],
      [literal('category'), 'ASC']
    ]
  })

  const categories = query
    .map(({dataValues}) => dataValues)
    .map(({year, month, category, total}) => ({
      category,
      date: moment().set({year, month: month - 1}).format('MMM YYYY'),
      total: Number(total)
    }))

  const months = categories.reduce((result, {date}) => {
    if (result.indexOf(date) < 0) result.push(date)
    return result
  }, [])

  const totals = categories
    .reduce((result, {date, category, total}) => {
      const amount = Math.abs(total)
      const index = months.indexOf(date)
      result[category] = result[category] || months.slice()
      result[category][index] = {date, amount}
      return result
    }, {})

  return totals
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
    transactions: transactions.map(({dataValues}) => dataValues),
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

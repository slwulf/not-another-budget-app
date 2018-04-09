const {Budget, Transaction} = require('../models')
const {Op} = require('sequelize')
const numeral = require('numeral')
const moment = require('moment')

module.exports = {
  get: getBudgets,
  create: createBudget,
  edit: editBudget,
  remove: removeBudget,
  view: view
}

function getBudgets(category) {
  return Budget
    .findAll({ where: {category} })
    .then((records = []) => records.map(r => r.dataValues))
}

function createBudget(category, amount) {
  return Budget
    .create({category, amount})
    .then(record => record.dataValues)
}

async function editBudget(budget) {
  const {id, amount, category} = budget
  const record = await Budget.findById(id)

  return record
    .update({
      amount: amount
        ? parseFloat(amount.replace(/\$|\,/g, ''))
        : record.amount,
      category: category || record.category
    }, { returning: true })
    .then(({dataValues}) => {
      dataValues.amount = numeral(dataValues.amount).format('$0,0.00')
      return dataValues
    })
}

function removeBudget(id) {
  return Budget.destroy({ where: {id} })
}

async function view({month = moment().month(), year = moment().year()}) {
  const date = moment().set({year, month})
  const categories = await categoryTotals(date)
  const budgets = await Budget
    .findAll({ order: [['category', 'ASC']] })
    .map(budget => {
      const amount = parseFloat(budget.amount) || 0
      const totalSpent = Math.abs(categories[budget.category]) || 0
      const remainder = amount - totalSpent
      const isOver = remainder < 0
      return {
        id: budget.id,
        category: budget.category,
        amount,
        totalSpent,
        remainder,
        isOver
      }
    })

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = Object.keys(categories).reduce((sum, key) => {
    const total = categories[key] || 0
    return sum + total
  }, 0)

  const totals = {
    budget: totalBudget,
    spent: totalSpent,
    remainder: totalBudget + totalSpent
  }

  return {
    viewName: 'budgets',
    budgets,
    totals,
    categories: [],
    date: date.format('MMMM YYYY'),
    currentDate: {
      month: date.format('MM'),
      year: date.format('YYYY')
    }
  }
}

function categoryTotals(date) {
  const min = date.clone().startOf('month')
  const max = date.clone().endOf('month')
  const where = {
    date: { [Op.gte]: min, [Op.lte]: max }
  }

  return Transaction.findAll({ where })
    .reduce((sums, {category, amount}) => {
      sums[category] = sums[category] || 0
      sums[category] += (parseFloat(amount) || 0)
      return sums
    }, {})
}

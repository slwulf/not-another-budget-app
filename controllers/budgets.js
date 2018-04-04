const {Budget} = require('../models')
const mongoose = require('mongoose')
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

function editBudget(budget) {
  const amount = budget.amount
  const category = budget.category

  return new Promise(function(resolve, reject) {
    mongoose.model('budgets')
      .findById(budget.id, function(err, b) {
        if (err) return reject(err)

        if (amount) b.amount = parseFloat(amount.replace(/\$|\,/g, ''))
        if (category) b.category = category.trim()

        b.save(function(err) {
          if (err) return reject(err)
          b.amount = numeral(b.amount).format('$0,0.00')
          resolve(b)
        })
      })
  })
}

function removeBudget(id) {
  return new Promise(function(resolve, reject) {
    mongoose.model('budgets')
      .findByIdAndRemove(id, function(err) {
        if (err) reject(err)
        else resolve(true)
      })
  })
}

function view(date) {
  const now = moment()
  const year = date.year ? parseInt(date.year, 10) : now.year()
  const month = date.month ? parseInt(date.month, 10) - 1 : now.month()
  const displayDate = moment().set({ year, month })
  const dateMin = displayDate.clone().startOf('month')
  const dateMax = displayDate.clone().endOf('month')

  return new Promise(function(resolve, reject) {
    const budgets = mongoose.model('budgets').find()
    const transactions = mongoose.model('transactions').find({
      date: { $gte: dateMin.toDate(), $lte: dateMax.toDate() }
    })

    transactions.exec(function(err, ts) {
      if (err) return reject(err)

      const categoryTotals = ts.reduce(function(o, t) {
        o[t.category] = o[t.category] || 0
        o[t.category] += t.amount
        return o
      }, {})

      budgets.exec(function(err, bs) {
        if (err) return reject(err)

        const viewBudgets = bs.map(function(b) {
          const total = Math.abs(categoryTotals[b.category]) || 0
          return {
            _id: b._id,
            category: b.category,
            amount: b.amount,
            totalSpent: total,
            remainder: (b.amount - total),
            isOver: (total > b.amount)
          }
        }).sort((a, b) => {
          const catA = a.category.toLowerCase()
          const catB = b.category.toLowerCase()
          if (catA < catB) return -1
          if (catA > catB) return 1
          return 0
        })

        const totalBudget = bs.reduce((sum, b) => sum += b.amount, 0)
        const totalSpent = ts.reduce((sum, t) => t.amount > 0 ? sum : sum += t.amount, 0)

        const viewTotals = {
          budget: totalBudget,
          spent: totalSpent,
          remainder: (totalBudget + totalSpent)
        }

        const existingBudgets = bs.map(b => b.category)
        const neededBudgets = Object.keys(categoryTotals)
          .filter(c => existingBudgets.indexOf(c) === -1)
          .sort()

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
        })
      })
    })
  })
}

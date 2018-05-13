const {Transaction, Budget} = require('../models')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const {pick, map, take} = require('ramda')

fs.readdirSync(path.join(__dirname, '..', 'models'))
  .map(fn => ~fn.indexOf('.mongoose') && require(`../models/${fn}`))

mongoose.connect('mongodb://localhost/nab-app')

;(async () => {
  const cleanBudgets = map(pick(['amount', 'category']))
  const cleanTransactions = map(pick(['amount', 'category', 'description', 'date']))
  const budgets = cleanBudgets(await mongoose.model('budgets').find())
  const transactions = cleanTransactions(await mongoose.model('transactions').find())

  console.log('Importing transactions...')
  await Transaction.bulkCreate(transactions)

  console.log('Importing budgets...')
  await Budget.bulkCreate(budgets)

  console.log('Done!')
  process.exit(0)
})()

/**
 * Transactions Model
 */

// deps
const db = require('mongoose')
const Schema = db.Schema

// create schema
const transactionsSchema = new Schema({
  description: String,
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now }
})

// register model with schema
db.model('transactions', transactionsSchema)

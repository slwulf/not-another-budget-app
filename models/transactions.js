/**
 * Transactions Model
 */

// deps
var db = require('mongoose');
var Schema = db.Schema;

// create schema
var transactionsSchema = new Schema({
  description: String,
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now }
});

// register model with schema
db.model('transactions', transactionsSchema);

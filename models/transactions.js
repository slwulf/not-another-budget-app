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
var T = db.model('transactions', transactionsSchema);

// create a few
[
  { description: 'test',
    amount: 99,
    category: 'Test' },
  { description: 'another test',
    amount: 99,
    category: 'Test' },
  { description: 'a thingy',
    amount: 99,
    category: 'Poop' },
  { description: 'wat',
    amount: 99,
    category: 'Poop' },
].map(function(tr) {
  T.create(tr, function(err, t) {
    if (err) console.log(err);
  });
});

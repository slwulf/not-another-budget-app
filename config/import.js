var fs = require('fs');
var db = require('mongoose');
var config = require('./import-config.json');

module.exports = function importCSV(file, cb, next) {
  var transactions = db.model('transactions');

  // clean and get array
  file.trim()
    .replace(/\"/g, '')
    .split('\n')

    // split lines into arrays
    .map(function(line) { return line.split(',') })

    // parse into array of objects
    .map(function(line) {
      var debit = line[config.debit];
      var credit = line[config.credit];
      var amount = debit ? parseFloat(debit) * -1 : parseFloat(credit);

      return {
        description: line[config.description],
        category: line[config.category],
        date: new Date(line[config.date]),
        amount: amount
      };
    })

    .forEach(function(doc) {
      // create transactions
      transactions.create(doc, function(err) {
        if (err) next(err);
      });
    });

  // res.send
  if (cb) cb({ status: 201, message: 'Import successful.' });
}

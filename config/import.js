var fs = require('fs');
var db = require('mongoose');

module.exports = function importCSV(file, cb, next) {
  var model = db.model('transactions');

  // clean and get array
  file.trim()
    .replace(/\"/g, '')
    .split('\n')

    // split lines into arrays
    .map(function(line) { return line.split(',') })

    // parse into array of objects
    .reduce(function(transactions, line) {
      var debit = line[6];
      var credit = line[7];
      var amount = debit ? parseFloat(debit) * -1 : credit;

      transactions.push({
        description: line[4],
        category: line[5],
        date: new Date(line[1]),
        amount: parseFloat(amount)
      });

      return transactions;
    }, [])

    // load models into db
    .map(function(doc) {
      model.create(doc, function(err) {
        if (err) next(err);
      });
    });

  cb({ status: 201, message: 'Import successful.' });
}

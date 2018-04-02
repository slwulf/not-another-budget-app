var fs = require('fs')
var db = require('mongoose')
var moment = require('moment')
var config = require('./import-config.json')

module.exports = function importData(separator, data) {
  var transactions = db.model('transactions')
  var sep = separator === 'comma' ? ',' : '\t'

  return new Promise(function(resolve, reject) {
    // clean and get array
    data.trim()
      .replace(/\"/g, '')
      .split('\n')

      // split lines into arrays
      .map(function(line) { return line.split(sep) })

      // parse into array of objects
      .map(function(line) {
        var parsedDate = moment(line[config.date], 'MM/DD/YYYY')
        var debit = line[config.debit]
        var credit = line[config.credit]
        var amount = debit ? parseFloat(debit) * -1 : parseFloat(credit)

        if (debit === credit) {
          amount = parseFloat(debit)
        }

        return {
          description: line[config.description],
          category: line[config.category],
          date: parsedDate.toDate(),
          amount: amount
        }
      })

      .forEach(function(doc) {
        transactions.create(doc, function(err) {
          if (err) reject(err)
        })
      })

    resolve({ status: 201, message: 'Import successful.' })
  })
}

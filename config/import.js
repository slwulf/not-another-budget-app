const fs = require('fs')
const db = require('mongoose')
const moment = require('moment')
const config = require('./import-config.json')

module.exports = function importData(separator, data) {
  const transactions = db.model('transactions')
  const sep = separator === 'comma' ? ',' : '\t'

  return new Promise(function(resolve, reject) {
    // clean and get array
    data.trim()
      .replace(/\"/g, '')
      .split('\n')

      // split lines into arrays
      .map(function(line) { return line.split(sep) })

      // parse into array of objects
      .map(function(line) {
        const parsedDate = moment(line[config.date], 'MM/DD/YYYY')
        const debit = line[config.debit]
        const credit = line[config.credit]
        const amount = debit ? parseFloat(debit) * -1 : parseFloat(credit)

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

const fs = require('fs')
const moment = require('moment')
const {Transaction} = require('../models')
const config = require('./import-config.json')

module.exports = function importData(data) {
  const transactions = parseCsv(data, config).map(row => {
    const date = moment(row.date, 'MM/DD/YYYY')
    const amount = row.debit
      ? Number(row.debit) * -1
      : Number(row.credit)

    return {
      description: row.description,
      category: row.category,
      date: date.toDate(),
      amount: row.debit === row.credit ? Number(row.debit) : amount
    }
  })

  return Transaction
    .bulkCreate(transactions)
    .then(() => ({
      status: 201,
      message: 'Import successful.'
    }))
}

function parseCsv(csv = '', cols = {}) {
  const separator = csv.indexOf('\t') > -1 ? '\t' : ','
  return csv.trim()
    .replace(/\"/g, '')
    .split('\n')
    .map(line => line.split(separator))
    .map(line => {
      return Object.keys(cols).reduce((row, key) => {
        const col = cols[key]
        row[key] = line[col]
        return row
      }, {})
    })
}

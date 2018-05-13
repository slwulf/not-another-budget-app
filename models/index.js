const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const {database} = require('../config')
const sequelize = new Sequelize(database.name, database.username, database.password, database)

const db = fs.readdirSync(__dirname)
  .filter(filename => {
    return filename.indexOf('.js') > 0 &&
      filename !== 'index.js' &&
      filename.indexOf('.mongoose') === -1
  })
  .reduce((db, filename) => {
    const model = sequelize.import(path.join(__dirname, filename))
    const name = model.name.charAt(0).toUpperCase() + model.name.slice(1)
    db[name] = model
    return db
  }, {})

Object.keys(db).forEach(model => {
  if ('associate' in db[model]) {
    db[model].associate(db)
  }
})

db.sequelize = sequelize

module.exports = db

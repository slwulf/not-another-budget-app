const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config').database

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, config)
  : new Sequelize(config.name, config.username, config.password, config)

const db = {}

fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 &&
      file !== 'index.js' &&
      file.indexOf('.mongoose') === -1
  })
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file))
    const name = model.name.charAt(0).toUpperCase() + model.name.slice(1)
    db[name] = model
  })

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize

module.exports = db

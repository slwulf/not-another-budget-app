const express = require('express')
const fs = require('fs')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// app
const app = express()
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public', 'stylesheets'),
  dest: path.join(__dirname, 'public', 'stylesheets'),
  outputStyle: 'compressed',
  sourceMap: false,
  prefix: '/stylesheets'
}))
app.use(express.static(path.join(__dirname, 'public')))

// routes
const routes = require('./routes/index')
app.use('/', routes)

// views
const hbs = require('./config/handlebars')
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

// models
require('./models').sequelize.sync()

// mongoose setup
fs.readdirSync(__dirname + '/models')
  .map(f => ~f.indexOf('.mongoose.js') && require(`./models/${f}`))

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/nab-app')

module.exports = app

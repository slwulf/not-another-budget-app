var express = require('express')
var fs = require('fs')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

// app
var app = express()
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
var routes = require('./routes/index')
app.use('/', routes)

// views
var hbs = require('./config/handlebars')
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

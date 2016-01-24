/**
 * Not Another Budget App
 * 0.0.0
 *
 */

// deps
var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('mongoose');

/**
 * init
 */

// app
var app = express();
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// routes
var routes = require('./routes/index');
app.use('/', routes);

// views
var hbs = require('./config/handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// models
fs.readdirSync(__dirname + '/models')
.map(function(fn) {
  if (~fn.indexOf('.js')) require('./models/' + fn);
});

// import
var importCSV = require('./config/import');
// importCSV(fs.readFileSync('./csv/transactions.csv', 'utf-8'));

// db
db.connect('mongodb://localhost/nab-app');

module.exports = app;

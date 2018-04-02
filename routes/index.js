var express = require('express')
var router = express.Router()

var api = require('./api')
var views = require('./views')

router.use('/', views)
router.use('/api', api)

module.exports = router

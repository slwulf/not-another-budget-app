const express = require('express')
const router = express.Router()

const api = require('./api')
const views = require('./views')

router.use('/', views)
router.use('/api', api)

module.exports = router

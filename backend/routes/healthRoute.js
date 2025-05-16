const express = require('express')
const { addHealthData } = require('../controllers/healthController')
const router = express.Router()

router.post('/track', addHealthData)

module.exports = router
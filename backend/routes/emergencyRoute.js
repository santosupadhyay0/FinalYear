const express = require('express')
const { triggerSOS } = require('../controllers/emergencyController')
const router = express.Router()

router.post('/alert', triggerSOS)

module.exports = router
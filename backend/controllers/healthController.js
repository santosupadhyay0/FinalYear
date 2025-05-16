const HealthData = require('../models/HealthData')

exports.addHealthData =  async (req, res) => {
    const {bloodPressure, weight} = req.body
    const data = new HealthData ({ userId : req.user.id, bloodPressure, weight})
    await data.save()
    res.status(201).json({ success : true })
}
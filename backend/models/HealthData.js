const mongoose = require('mongoose')

const healthSchema = new mongoose.Schema ({
    userId : {
        type: String,
        required:true
    },
    bloodPressure : {
        systolic:Number,
        distolic:Number
    },
    weight:Number,
    createdAt : {
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('HealthData', healthSchema)
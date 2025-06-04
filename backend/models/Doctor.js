const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    doctorValidationId: {
      type: String,
      required: true,
      unique: true,
    },
    levelOfStudy: {
      type: String,
      required: true,
    },
    workplace: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "https://via.placeholder.com/100",
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model('Doctor', doctorSchema)
module.exports = Doctor
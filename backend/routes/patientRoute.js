const express = require("express");
const router = express.Router();
const {
  registerPatient,
  loginPatient,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

router.post("/register",registerPatient);
router.post("/login", loginPatient);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

module.exports = router;

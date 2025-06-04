const express = require("express");
const router = express.Router();
const {
  registerDoctor,
  loginDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
} = require("../controllers/doctorController");

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.get("/all", getAllDoctors);
router.get("/:id", getDoctorById);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

module.exports = router;

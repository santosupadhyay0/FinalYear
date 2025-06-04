const express = require('express')
const { addHealthData } = require('../controllers/healthController')
const router = express.Router()

// Array of health tips for pregnant women
const healthTips = [
  "Stay hydrated by drinking plenty of water throughout the day.",
  "Eat a balanced diet rich in fruits, vegetables, and whole grains.",
  "Take prenatal vitamins as recommended by your healthcare provider.",
  "Engage in regular, moderate exercise like walking or prenatal yoga.",
  "Get enough sleep and rest to support your body's needs.",
  "Avoid alcohol, smoking, and other harmful substances.",
  "Attend all prenatal checkups to monitor your baby's health.",
  "Practice good hygiene to prevent infections.",
  "Manage stress through relaxation techniques like deep breathing.",
  "Educate yourself about childbirth and parenting to feel more prepared."
];

// Route to get a random health tip
router.get('/health-tip', (req, res) => {
  const randomIndex = Math.floor(Math.random() * healthTips.length);
  const randomTip = healthTips[randomIndex];
  res.status(200).json(randomTip);
});

router.post('/track', addHealthData)

module.exports = router
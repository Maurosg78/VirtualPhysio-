const express = require("express");
const router = express.Router();
const { getEvaluations, getTreatments } = require("../rules");

// Endpoint para sugerir evaluaciones según categorías detectadas
router.post("/evaluations", (req, res) => {
  const { categories } = req.body; 
  // categories es un objeto como { dolorLumbar: true, dolorRodilla: false, ... }

  const suggestedEvaluations = getEvaluations(categories);

  res.json({
    message: "Evaluaciones sugeridas",
    evaluations: suggestedEvaluations
  });
});

// Endpoint para sugerir tratamientos basados en categorías + resultados de evaluaciones
router.post("/treatments", (req, res) => {
  const { categories, evalResults } = req.body;
  // categories es un objeto de síntomas
  // evalResults es un objeto como { flexion: "limitada", lasegue: "negativa", ... }

  const suggestedTreatments = getTreatments(categories, evalResults);

  res.json({
    message: "Tratamientos sugeridos",
    treatments: suggestedTreatments
  });
});

module.exports = router;
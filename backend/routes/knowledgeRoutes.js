// Archivo: routes/analyzeTextRoutes.js

const express = require("express");
const router = express.Router();
const baseKnowledge = require("../data/baseKnowledge.json");

// Reglas de palabras clave por patología
const keywordRules = {
  rodilla: {
    tendinopatia_rotuliana: ["tendón", "rotuliano", "saltador", "anterior", "escaleras", "correr"],
    meniscopatia: ["menisco", "dolor medial", "rotación", "bloqueo", "chasquido"],
    artrosis_rodilla: ["artrosis", "degenerativa", "crepitación", "limitación"]
  },
  hombro: {
    tendinopatia_manguito: ["manguito", "rotador", "abducción", "dolor lateral", "Neer"],
    capsulitis_adhesiva: ["hombro congelado", "restricción", "movilidad", "dolor nocturno"]
  },
  lumbar: {
    hernia_discal_lumbar: ["ciática", "flexión lumbar", "irradiado", "parestesia", "hernia"],
    lumbalgia_mecánica: ["lumbalgia", "paravertebrales", "espasmo", "sobreesfuerzo"]
  }
};

router.post("/analyze-text", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Texto requerido" });

  let detectedRegion = null;
  let highestScore = 0;
  let bestMatches = [];

  for (const region in keywordRules) {
    const regionRules = keywordRules[region];
    for (const pathologyId in regionRules) {
      const keywords = regionRules[pathologyId];
      const score = keywords.reduce((acc, word) => acc + (text.toLowerCase().includes(word) ? 1 : 0), 0);

      if (score > highestScore) {
        highestScore = score;
        bestMatches = [{ region, pathologyId }];
      } else if (score === highestScore && score > 0) {
        bestMatches.push({ region, pathologyId });
      }
    }
  }

  if (bestMatches.length === 0) {
    return res.status(200).json({ message: "No se encontraron coincidencias" });
  }

  // Obtener detalles desde baseKnowledge
  const result = bestMatches.map(({ region, pathologyId }) => {
    const regionData = baseKnowledge[region];
    const pathologyData = regionData?.pathologies.find((p) => p.id === pathologyId);
    return pathologyData;
  });

  return res.status(200).json({
    message: "Patologías con mayor puntaje",
    region: bestMatches[0].region,
    pathologies: result
  });
});

module.exports = router;

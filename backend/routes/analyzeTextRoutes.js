const express = require("express");
const fs = require("fs");
const path = require("path");
const { questionTriggers } = require("../questionTriggers");

const router = express.Router();

/**
 * Diccionario de palabras clave para cada patología (region-based).
 * Mantenemos la lógica actual para pathologies.
 */
const keywordScores = {
  // Rodilla
  tendinopatia_rotuliana: {
    keywords: ["rodilla", "anterior", "saltador", "salto", "escaleras"],
    region: "rodilla"
  },
  meniscopatia: {
    keywords: ["rodilla", "menisco", "click", "bloqueo", "rotacion"],
    region: "rodilla"
  },
  // Hombro
  tendinopatia_manguito: {
    keywords: ["hombro", "abduccion", "subacromial", "manguito", "impingement"],
    region: "hombro"
  },
  // Lumbar
  hernia_discal_lumbar: {
    keywords: ["lumbar", "lumbares", "ciatico", "irradiado", "discal", "hernia"],
    region: "lumbar"
  }
};

/**
 * Función para detectar preguntas sugeridas
 * según questionTriggers
 */
function detectQuestions(lowerText) {
  let allQuestions = [];
  for (const key in questionTriggers) {
    const { keywords, questions } = questionTriggers[key];
    // Si se detecta una de las keywords, añadimos las preguntas
    if (keywords.some(kw => lowerText.includes(kw))) {
      allQuestions = allQuestions.concat(questions);
    }
  }
  return allQuestions;
}

/**
 * POST /api/analyze-text
 * Recibe un texto (ej. anamnesis) y asigna puntajes a cada patología.
 * Luego, busca en baseKnowledge.json la(s) patología(s) con mayor puntaje
 * y añade las preguntas sugeridas (suggestedQuestions).
 */
router.post("/analyze-text", (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Falta el campo 'text' en el body." });
  }

  const lowerText = text.toLowerCase();

  // 1. Calcular puntaje para cada patología
  const scores = {};
  for (const pathologyId in keywordScores) {
    scores[pathologyId] = 0;
    const { keywords } = keywordScores[pathologyId];
    keywords.forEach((kw) => {
      if (lowerText.includes(kw)) {
        scores[pathologyId] += 1;
      }
    });
  }

  // 2. Determinar la(s) patología(s) con mayor puntaje
  let maxScore = 0;
  for (const pathologyId in scores) {
    if (scores[pathologyId] > maxScore) {
      maxScore = scores[pathologyId];
    }
  }
  const topPathologies = Object.keys(scores).filter(
    (pId) => scores[pId] === maxScore && maxScore > 0
  );

  // Si maxScore es 0, no detectamos nada
  if (maxScore === 0) {
    // Aun así detectamos preguntas
    const suggestedQuestions = detectQuestions(lowerText);
    return res.json({
      message: "No se detectó ninguna patología relevante.",
      region: null,
      pathologies: [],
      suggestedQuestions
    });
  }

  // 3. Cargar baseKnowledge.json
  const filePath = path.join(__dirname, "..", "data", "baseKnowledge.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer baseKnowledge.json:", err);
      return res.status(500).json({ error: "Error interno al leer la base de conocimiento." });
    }

    try {
      const baseKnowledge = JSON.parse(data);

      // Recolectamos las patologías (con sus tests y treatments) de las que obtuvieron maxScore
      const foundPathologies = [];
      topPathologies.forEach((pId) => {
        const region = keywordScores[pId].region;
        const regionData = baseKnowledge[region];
        if (regionData && regionData.pathologies) {
          const found = regionData.pathologies.find(pt => pt.id === pId);
          if (found) {
            foundPathologies.push(found);
          }
        }
      });

      // Determinar la región principal si solo hay 1 patología
      let mainRegion = null;
      if (topPathologies.length === 1) {
        mainRegion = keywordScores[topPathologies[0]].region;
      }

      // Detectar preguntas basadas en questionTriggers
      const suggestedQuestions = detectQuestions(lowerText);

      return res.json({
        message: "Patologías con mayor puntaje",
        region: mainRegion,
        pathologies: foundPathologies,
        suggestedQuestions
      });
    } catch (parseErr) {
      console.error("Error al parsear baseKnowledge.json:", parseErr);
      return res.status(500).json({ error: "Error al parsear JSON." });
    }
  });
});

module.exports = router;

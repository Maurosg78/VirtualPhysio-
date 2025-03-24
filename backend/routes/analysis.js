const express = require("express");
const router = express.Router();
const nlp = require("compromise");

router.post("/analysis", (req, res) => {
  const { text } = req.body;
  // Analiza el texto con compromise
  const doc = nlp(text.toLowerCase());

  // Identifica palabras clave
  const hasDolorLumbar = doc.match("dolor lumbar").found;
  const hasIbuprofeno = doc.match("ibuprofeno").found;

  // Arma la respuesta
  const categories = {
    dolorLumbar: hasDolorLumbar,
    ibuprofeno: hasIbuprofeno
    // Agrega más categorías según necesites
  };

  res.json({ categories });
});

module.exports = router;

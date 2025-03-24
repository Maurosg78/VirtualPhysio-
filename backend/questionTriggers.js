const questionTriggers = {
  medicamentos: {
    keywords: ["ibuprofeno", "paracetamol", "medicamento"],
    questions: [
      "¿Alérgico a algún medicamento?",
      "¿Ha tenido reacciones adversas anteriormente?"
    ]
  },
  dolor: {
    keywords: ["dolor", "molestia", "dolor crónico", "lesion"],
    questions: [
      "En una escala de 0-10, ¿cómo lo calificaría?",
      "¿Cuándo inició el dolor?",
      "¿Factores que lo alivian o empeoran?"
    ]
  },
  // Puedes añadir más triggers
};

module.exports = { questionTriggers };

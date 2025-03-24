// Ejemplo de reglas muy simples para evaluaciones y tratamientos

const evaluations = {
  dolorLumbar: ["Prueba de flexión lumbar", "Prueba de Lasègue"],
  dolorRodilla: ["Prueba de McMurray", "Prueba de cajón anterior"]
};

const treatments = {
  "dolorLumbar+flexionLimitada": [
    "Ejercicios de estiramiento lumbar",
    "Fortalecimiento del core"
  ]
};

// Devuelve un array de evaluaciones sugeridas según las categorías detectadas
function getEvaluations(categories) {
  let result = [];
  if (categories.dolorLumbar) {
    result = [...result, ...evaluations.dolorLumbar];
  }
  if (categories.dolorRodilla) {
    result = [...result, ...evaluations.dolorRodilla];
  }
  // Agrega más condiciones según tu necesidad
  return result;
}

// Devuelve un array de tratamientos sugeridos según categorías y resultados de evaluaciones
function getTreatments(categories, evalResults) {
  let result = [];
  // Si hay dolorLumbar y la prueba de flexión lumbar salió "limitada"
  if (categories.dolorLumbar && evalResults.flexion === "limitada") {
    result = [...result, ...treatments["dolorLumbar+flexionLimitada"]];
  }
  // Agrega más condiciones según tu necesidad
  return result;
}

module.exports = { getEvaluations, getTreatments };

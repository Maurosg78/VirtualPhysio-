const express = require("express");
const axios = require("axios");
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  addTestToPatient,
  addTreatmentToPatient
} = require("../db");

const router = express.Router();

/**
 * POST /api/maiple/patients
 * Crea un nuevo paciente en mAIple
 */
router.post("/maiple/patients", (req, res) => {
  const { name, age, notes } = req.body;
  if (!name || !age) {
    return res.status(400).json({ error: "Faltan campos obligatorios (name, age)" });
  }
  const newPatient = createPatient({ name, age, notes });
  return res.status(201).json({ message: "Paciente creado en mAIple", patient: newPatient });
});

/**
 * GET /api/maiple/patients
 * Devuelve todos los pacientes
 */
router.get("/maiple/patients", (req, res) => {
  const patients = getAllPatients();
  return res.json(patients);
});

/**
 * GET /api/maiple/patients/:id
 * Devuelve un paciente por su ID
 */
router.get("/maiple/patients/:id", (req, res) => {
  const patient = getPatientById(req.params.id);
  if (!patient) return res.status(404).json({ error: "Paciente no encontrado" });
  return res.json(patient);
});

/**
 * PUT /api/maiple/patients/:id
 * Actualiza las notas de un paciente
 */
router.put("/maiple/patients/:id", (req, res) => {
  const updated = updatePatient(req.params.id, { notes: req.body.notes });
  if (!updated) return res.status(404).json({ error: "Paciente no encontrado" });
  return res.json({ message: "Paciente actualizado", patient: updated });
});

/**
 * POST /api/maiple/analyze-patient/:id
 * Llama al endpoint local de Nexia (analyze-text) con las notas del paciente
 */
router.post("/maiple/analyze-patient/:id", async (req, res) => {
  const patient = getPatientById(req.params.id);
  if (!patient) return res.status(404).json({ error: "Paciente no encontrado" });
  if (!patient.notes) return res.status(400).json({ error: "El paciente no tiene notas para analizar" });

  try {
    const response = await axios.post("http://localhost:3001/api/analyze-text", {
      text: patient.notes
    });
    return res.json({
      message: `Resultado del análisis para el paciente ${patient.name}`,
      analyzeResult: response.data
    });
  } catch (error) {
    console.error("Error al llamar a /api/analyze-text:", error.message);
    return res.status(500).json({ error: "Error interno al analizar el texto" });
  }
});

/**
 * POST /api/maiple/patients/:id/tests
 * Guarda los resultados de pruebas (tests) realizadas a un paciente
 */
router.post("/maiple/patients/:id/tests", (req, res) => {
  const { testId, result, notes } = req.body;
  if (!testId || !result) {
    return res.status(400).json({ error: "Faltan campos obligatorios (testId, result)" });
  }
  const added = addTestToPatient(req.params.id, {
    testId,
    result,
    notes: notes || ""
  });
  if (!added) return res.status(404).json({ error: "Paciente no encontrado" });

  const patient = getPatientById(req.params.id);
  return res.json({ message: "Prueba registrada", test: added, patient });
});

/**
 * POST /api/maiple/patients/:id/treatments
 * Guarda los tratamientos elegidos para un paciente
 */
router.post("/maiple/patients/:id/treatments", (req, res) => {
  const { treatmentId, notes } = req.body;
  if (!treatmentId) {
    return res.status(400).json({ error: "Falta el campo 'treatmentId'" });
  }
  const added = addTreatmentToPatient(req.params.id, {
    treatmentId,
    notes: notes || ""
  });
  if (!added) return res.status(404).json({ error: "Paciente no encontrado" });

  const patient = getPatientById(req.params.id);
  return res.json({ message: "Tratamiento registrado", treatment: added, patient });
});

/**
 * GET /api/maiple/patients/:id/report
 * Genera un informe del paciente con toda la info
 */
router.get("/maiple/patients/:id/report", (req, res) => {
  const patient = getPatientById(req.params.id);
  if (!patient) return res.status(404).json({ error: "Paciente no encontrado" });

  const report = {
    patientName: patient.name,
    age: patient.age,
    notes: patient.notes,
    testsPerformed: patient.testsPerformed,
    treatmentsChosen: patient.treatmentsChosen
  };

  return res.json({
    message: `Reporte generado para ${patient.name}`,
    report
  });
});

module.exports = router;


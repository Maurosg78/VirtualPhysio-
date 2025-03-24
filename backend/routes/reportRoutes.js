const express = require("express");
const { getPatientById } = require("../db.js");

const router = express.Router();

router.get("/report/:id", (req, res) => {
  const patient = getPatientById(req.params.id);
  if (!patient) {
    return res.status(404).json({ error: "Paciente no encontrado" });
  }
  const report = {
    patientName: patient.name,
    age: patient.age,
    notes: patient.notes,
    testsPerformed: patient.testsPerformed,
    treatmentsChosen: patient.treatmentsChosen
  };
  return res.json({ message: `Reporte generado para ${patient.name}`, report });
});

module.exports = router;
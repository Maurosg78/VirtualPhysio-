// backend/db.js
let patients = [];
let currentId = 1;

function createPatient({ name, age, notes = "" }) {
  const newPatient = {
    id: currentId++,
    name,
    age,
    notes,
    testsPerformed: [],
    treatmentsChosen: []
  };
  patients.push(newPatient);
  return newPatient;
}

function getAllPatients() {
  return patients;
}

function getPatientById(id) {
  return patients.find(p => p.id === parseInt(id));
}

function updatePatient(id, updates) {
  const patientIndex = patients.findIndex(p => p.id === parseInt(id));
  if (patientIndex === -1) return null;
  patients[patientIndex] = { ...patients[patientIndex], ...updates };
  return patients[patientIndex];
}

function addTestToPatient(id, test) {
  const patient = getPatientById(id);
  if (!patient) return null;
  patient.testsPerformed.push(test);
  return test;
}

function addTreatmentToPatient(id, treatment) {
  const patient = getPatientById(id);
  if (!patient) return null;
  patient.treatmentsChosen.push(treatment);
  return treatment;
}

function resetDB() {
  patients = [];
  currentId = 1;
}

module.exports = {
  patients,
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  addTestToPatient,
  addTreatmentToPatient,
  resetDB
};

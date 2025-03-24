const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const validate = require('../middleware/validate');
const { patientSchema, clinicalRecordSchema, syncSchema } = require('../validators/schemas');

const prisma = new PrismaClient();

// Middleware para verificar disponibilidad
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Rutas de Pacientes
router.get('/patients', async (req, res, next) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(patients);
  } catch (error) {
    next(error);
  }
});

router.post('/patients', validate(patientSchema), async (req, res, next) => {
  try {
    const patient = await prisma.patient.create({
      data: req.body
    });
    res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
});

router.put('/patients/:id', validate(patientSchema), async (req, res, next) => {
  try {
    const patient = await prisma.patient.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(patient);
  } catch (error) {
    next(error);
  }
});

router.delete('/patients/:id', async (req, res, next) => {
  try {
    await prisma.patient.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Rutas de Fichas Clínicas
router.get('/clinical-records/:patientId', async (req, res, next) => {
  try {
    const record = await prisma.clinicalRecord.findFirst({
      where: { patientId: req.params.patientId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(record);
  } catch (error) {
    next(error);
  }
});

router.post('/clinical-records/:patientId', validate(clinicalRecordSchema), async (req, res, next) => {
  try {
    const record = await prisma.clinicalRecord.create({
      data: {
        ...req.body,
        patientId: req.params.patientId
      }
    });
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
});

// Ruta de Sincronización
router.post('/sync', validate(syncSchema), async (req, res, next) => {
  try {
    const { patients, clinicalRecords } = req.body;

    // Actualizar pacientes
    const updatedPatients = await Promise.all(
      patients.map(async (patient) => {
        return prisma.patient.upsert({
          where: { id: patient.id },
          update: patient,
          create: patient
        });
      })
    );

    // Actualizar fichas clínicas
    const updatedRecords = await Promise.all(
      Object.entries(clinicalRecords).map(async ([patientId, record]) => {
        return prisma.clinicalRecord.create({
          data: {
            ...record,
            patientId
          }
        });
      })
    );

    res.json({
      patients: updatedPatients,
      clinicalRecords: updatedRecords
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 
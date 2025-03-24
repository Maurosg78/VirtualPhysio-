const { z } = require('zod');

// Esquema base para campos comunes
const timestampsSchema = {
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
};

// Esquema de Paciente
const patientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido').optional().nullable(),
  phone: z.string().regex(/^\+?\d{8,15}$/, 'Número de teléfono inválido').optional().nullable(),
  birthDate: z.string().datetime().optional().nullable(),
  gender: z.enum(['M', 'F', 'O']).optional().nullable(),
  address: z.string().max(200, 'La dirección no puede exceder 200 caracteres').optional().nullable(),
  ...timestampsSchema,
});

// Esquema de Ficha Clínica
const clinicalRecordSchema = z.object({
  id: z.string().uuid().optional(),
  patientId: z.string().uuid('ID de paciente inválido'),
  anamnesis: z.string().max(2000, 'La anamnesis no puede exceder 2000 caracteres').optional().nullable(),
  objectives: z.string().max(500, 'Los objetivos no pueden exceder 500 caracteres').optional().nullable(),
  painScale: z.number().min(0).max(10, 'La escala de dolor debe estar entre 0 y 10').optional().nullable(),
  diagnosis: z.string().max(1000, 'El diagnóstico no puede exceder 1000 caracteres').optional().nullable(),
  treatment: z.string().max(2000, 'El tratamiento no puede exceder 2000 caracteres').optional().nullable(),
  notes: z.string().max(1000, 'Las notas no pueden exceder 1000 caracteres').optional().nullable(),
  ...timestampsSchema,
});

// Esquema de Sincronización
const syncSchema = z.object({
  patients: z.array(patientSchema),
  clinicalRecords: z.record(z.string(), clinicalRecordSchema),
  lastSync: z.string().datetime().optional().nullable(),
});

module.exports = {
  patientSchema,
  clinicalRecordSchema,
  syncSchema,
}; 
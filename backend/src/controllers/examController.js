const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/exams');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  }
});

const examController = {
  // Subir un nuevo examen
  async uploadExam(req, res, next) {
    try {
      const { patientId, type, date, provider, notes } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo' });
      }

      const exam = await prisma.medicalExam.create({
        data: {
          patientId,
          type,
          date: new Date(date),
          provider,
          fileUrl: file.path,
          notes
        }
      });

      res.json(exam);
    } catch (error) {
      next(error);
    }
  },

  // Obtener exámenes de un paciente
  async getPatientExams(req, res, next) {
    try {
      const { patientId } = req.params;
      const exams = await prisma.medicalExam.findMany({
        where: { patientId },
        include: {
          results: true
        },
        orderBy: { date: 'desc' }
      });

      res.json(exams);
    } catch (error) {
      next(error);
    }
  },

  // Agregar resultados a un examen
  async addExamResults(req, res, next) {
    try {
      const { examId } = req.params;
      const results = req.body;

      const examResults = await Promise.all(
        results.map(result =>
          prisma.examResult.create({
            data: {
              examId,
              ...result
            }
          })
        )
      );

      res.json(examResults);
    } catch (error) {
      next(error);
    }
  },

  // Eliminar un examen
  async deleteExam(req, res, next) {
    try {
      const { examId } = req.params;
      
      // Obtener información del examen
      const exam = await prisma.medicalExam.findUnique({
        where: { id: examId }
      });

      if (!exam) {
        return res.status(404).json({ error: 'Examen no encontrado' });
      }

      // Eliminar el archivo físico
      if (exam.fileUrl) {
        await fs.unlink(exam.fileUrl).catch(console.error);
      }

      // Eliminar el examen y sus resultados
      await prisma.medicalExam.delete({
        where: { id: examId }
      });

      res.json({ message: 'Examen eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = {
  examController,
  upload
}; 
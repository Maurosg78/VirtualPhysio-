const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const assistantController = {
  // Elementos a verificar en la evaluación clínica
  async getChecklistItems(context) {
    const checklistItems = {
      initial: [
        "Motivo de consulta",
        "Historia médica",
        "Medicamentos actuales",
        "Alergias",
        "Cirugías previas"
      ],
      evaluation: [
        "Escala de dolor",
        "Rango de movimiento",
        "Fuerza muscular",
        "Pruebas especiales",
        "Postura y marcha"
      ],
      exams: [
        "Exámenes de laboratorio",
        "Imágenes diagnósticas",
        "Otros estudios"
      ],
      treatment: [
        "Objetivos de tratamiento",
        "Plan de ejercicios",
        "Recomendaciones",
        "Seguimiento"
      ]
    };

    // Obtener elementos ya verificados
    const verifiedItems = await prisma.clinicalChecklist.findMany({
      where: {
        patientId: context.patientId,
        status: 'Completado'
      },
      select: { item: true }
    });

    const verifiedItemNames = verifiedItems.map(item => item.item);

    // Filtrar elementos pendientes
    const pendingItems = Object.values(checklistItems)
      .flat()
      .filter(item => !verifiedItemNames.includes(item));

    return pendingItems;
  },

  // Procesar mensaje y extraer información relevante
  async processMessage(message, context) {
    const processedData = {
      type: 'information',
      data: {
        text: message,
        timestamp: new Date(),
        context: context,
        extractedInfo: {}
      }
    };

    // Patrones para identificar información relevante
    const patterns = {
      painScale: /(?:dolor|molestia|incomodidad)\s*(?:de|en|es)\s*(\d+)(?:\s*\/\s*10)?/i,
      medications: /(?:tomo|estoy tomando|medicamento|fármaco)\s+([^.,]+)/gi,
      allergies: /(?:alergia|alérgico|alérgica)\s+(?:a|a los|a las)\s+([^.,]+)/gi,
      surgeries: /(?:cirugía|operación|intervención)\s+(?:de|en)\s+([^.,]+)/gi,
      exams: /(?:examen|estudio|análisis)\s+(?:de|de sangre|de laboratorio)\s+([^.,]+)/gi
    };

    // Extraer información basada en patrones
    for (const [key, pattern] of Object.entries(patterns)) {
      const matches = [...message.matchAll(pattern)];
      if (matches.length > 0) {
        processedData.data.extractedInfo[key] = matches.map(match => match[1].trim());
      }
    }

    // Identificar el tipo de información proporcionada
    const infoTypes = {
      painScale: processedData.data.extractedInfo.painScale,
      medications: processedData.data.extractedInfo.medications,
      allergies: processedData.data.extractedInfo.allergies,
      surgeries: processedData.data.extractedInfo.surgeries,
      exams: processedData.data.extractedInfo.exams
    };

    // Actualizar el checklist según la información extraída
    if (context.patientId) {
      await this.updateChecklistFromExtractedInfo(context.patientId, infoTypes);
    }

    return processedData;
  },

  // Actualizar el checklist basado en la información extraída
  async updateChecklistFromExtractedInfo(patientId, infoTypes) {
    const checklistUpdates = {
      'Escala de dolor': infoTypes.painScale?.length > 0,
      'Medicamentos actuales': infoTypes.medications?.length > 0,
      'Alergias': infoTypes.allergies?.length > 0,
      'Cirugías previas': infoTypes.surgeries?.length > 0,
      'Exámenes de laboratorio': infoTypes.exams?.length > 0
    };

    for (const [item, isCompleted] of Object.entries(checklistUpdates)) {
      if (isCompleted) {
        await prisma.clinicalChecklist.upsert({
          where: {
            patientId_item: {
              patientId,
              item
            }
          },
          update: {
            status: 'Completado'
          },
          create: {
            patientId,
            item,
            status: 'Completado'
          }
        });
      }
    }
  },

  // Manejar la conversación
  async handleConversation(req, res, next) {
    try {
      const { message, context } = req.body;

      // Procesar el mensaje
      const processedData = await this.processMessage(message, context);

      // Obtener elementos pendientes del checklist
      const pendingItems = await this.getChecklistItems(context);

      // Guardar el mensaje en el historial
      await prisma.chatMessage.create({
        data: {
          message,
          response: JSON.stringify({ pendingItems, processedData }),
          context: JSON.stringify(context)
        }
      });

      res.json({
        response: {
          pendingItems,
          processedData
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = assistantController; 
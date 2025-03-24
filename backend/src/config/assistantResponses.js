const responses = {
  greetings: {
    patterns: ['hola', 'buenos días', 'buenas tardes', 'buenas noches'],
    response: '¡Hola! Soy Nexia, tu asistente virtual. ¿En qué puedo ayudarte hoy?'
  },
  evaluations: {
    patterns: ['evaluación', 'evaluar', 'examinar', 'revisar'],
    response: `Para realizar una evaluación, necesito saber:
1. ¿Qué tipo de dolor o molestia presenta el paciente?
2. ¿En qué zona específica?
3. ¿Cuánto tiempo lleva con la molestia?
4. ¿Hay algún factor que agrave o alivie el dolor?
5. ¿Ha tenido algún tratamiento previo?`
  },
  treatments: {
    patterns: ['tratamiento', 'ejercicios', 'terapia', 'rehabilitación'],
    response: `Para sugerir un tratamiento, necesito saber:
1. ¿Qué tipo de lesión o condición tiene el paciente?
2. ¿Qué evaluaciones se han realizado?
3. ¿Hay alguna contraindicación que deba tener en cuenta?
4. ¿Qué objetivos tiene el paciente?
5. ¿Qué nivel de actividad física realiza habitualmente?`
  },
  painScale: {
    patterns: ['escala de dolor', 'dolor', 'molestia'],
    response: `Por favor, indícame en una escala del 0 al 10:
0 = Sin dolor
1-3 = Dolor leve
4-6 = Dolor moderado
7-10 = Dolor intenso

¿En qué nivel está el dolor del paciente?`
  },
  exercises: {
    patterns: ['ejercicio', 'ejercicios', 'rutina'],
    response: `Para recomendar ejercicios, necesito saber:
1. ¿Qué tipo de ejercicio busca?
2. ¿Qué nivel de dificultad prefiere?
3. ¿Tiene acceso a algún equipo específico?
4. ¿Hay alguna limitación de movimiento?
5. ¿Cuánto tiempo puede dedicar a los ejercicios?`
  },
  thanks: {
    patterns: ['gracias', 'muchas gracias', 'te agradezco'],
    response: '¡De nada! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?'
  },
  goodbye: {
    patterns: ['adiós', 'hasta luego', 'hasta pronto', 'chao'],
    response: '¡Hasta luego! Que tengas un excelente día. Recuerda que estoy aquí para ayudarte cuando lo necesites.'
  },
  help: {
    patterns: ['ayuda', 'ayúdame', 'qué puedes hacer'],
    response: `Puedo ayudarte con:
1. Realizar evaluaciones iniciales
2. Sugerir tratamientos y ejercicios
3. Evaluar la escala de dolor
4. Crear rutinas de ejercicios
5. Responder preguntas generales sobre fisioterapia

¿En qué área específica necesitas ayuda?`
  },
  default: {
    response: 'Lo siento, no entiendo tu pregunta. ¿Podrías reformularla? También puedes pedir ayuda escribiendo "ayuda" para ver qué puedo hacer por ti.'
  }
};

module.exports = responses; 
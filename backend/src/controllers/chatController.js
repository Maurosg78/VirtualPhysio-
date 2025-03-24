const { PrismaClient } = require('@prisma/client');
const responses = require('../config/assistantResponses');
const prisma = new PrismaClient();

const chatController = {
  async handleMessage(req, res, next) {
    try {
      const { message } = req.body;
      const lowerMessage = message.toLowerCase();

      // Buscar una respuesta que coincida con el mensaje
      let response = responses.default.response;
      
      for (const [key, value] of Object.entries(responses)) {
        if (key === 'default') continue;
        
        if (value.patterns.some(pattern => lowerMessage.includes(pattern))) {
          response = value.response;
          break;
        }
      }

      // Guardar la conversación en la base de datos
      await prisma.chatMessage.create({
        data: {
          message,
          response,
          timestamp: new Date()
        }
      });

      res.json({ response });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = chatController; 
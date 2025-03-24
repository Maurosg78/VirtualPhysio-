const { ZodError } = require('zod');

const validate = (schema) => async (req, res, next) => {
  try {
    // Validar el cuerpo de la petición contra el esquema
    const validatedData = await schema.parseAsync(req.body);
    
    // Reemplazar el cuerpo con los datos validados y transformados
    req.body = validatedData;
    
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Formatear errores de validación
      const errors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));

      res.status(400).json({
        error: 'Error de validación',
        details: errors
      });
    } else {
      next(error);
    }
  }
};

module.exports = validate; 
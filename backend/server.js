const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba (raíz)
app.get("/", (req, res) => {
  res.send("¡Bienvenido al backend de VirtualPhysio!");
});

// Rutas API
app.use("/api", require("./routes/analysis"));               // Análisis
app.use("/api", require("./routes/recommendations"));        // Recomendaciones
app.use("/api", require("./routes/knowledgeRoutes"));        // Conocimiento base
app.use("/api", require("./routes/analyzeTextRoutes"));      // Análisis de texto
app.use("/api", require("./routes/reportRoutes"));           // Generación de informes
app.use("/api", require("./routes/maipleRoutes"));           // Ficha clínica mAIple

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

import React, { useState, useEffect, useCallback } from "react";
import { Box, Paper, Typography, TextField, Grid, Chip, Button, Snackbar, Alert } from "@mui/material";
import PropTypes from 'prop-types';
import axios from 'axios';

// Mover palabrasClave fuera del componente ya que es una constante
const palabrasClave = {
  motivoConsulta: ["consulta", "viene por", "presenta", "siente"],
  antecedentes: ["antes", "previamente", "historia", "antecedente"],
  sintomas: ["dolor", "molestia", "rigidez", "inflamación", "hinchazón"],
  diagnostico: ["diagnóstico", "patología", "lesión", "afectación"],
  planTratamiento: ["tratamiento", "ejercicio", "terapia", "rehabilitación"]
};

function FichaClinica({ patientId }) {
  const [notas, setNotas] = useState("");
  const [secciones, setSecciones] = useState({
    motivoConsulta: "",
    antecedentes: "",
    sintomas: "",
    objetivos: [],
    diagnostico: "",
    planTratamiento: "",
    escalaDolor: 0
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const detectarEscalaDolor = useCallback((linea) => {
    if (linea.toLowerCase().includes("dolor") && /\d+/.test(linea)) {
      const nivelDolor = parseInt(linea.match(/\d+/)[0]);
      return nivelDolor;
    }
    return 0;
  }, []);

  const detectarObjetivo = useCallback((linea) => {
    const lineaLower = linea.toLowerCase();
    if (lineaLower.includes("objetivo") || lineaLower.includes("meta")) {
      return linea.replace(/^[-•*]\s*/, "").trim();
    }
    return null;
  }, []);

  const detectarSeccion = useCallback((linea, seccion, keywords) => {
    const lineaLower = linea.toLowerCase();
    if (keywords.some(keyword => lineaLower.includes(keyword))) {
      return linea;
    }
    return "";
  }, []);

  const procesarTexto = useCallback((texto) => {
    const lineas = texto.split('\n');
    let nuevaSeccion = { ...secciones };
    
    lineas.forEach(linea => {
      // Detectar escala de dolor
      const nivelDolor = detectarEscalaDolor(linea);
      if (nivelDolor > 0) {
        nuevaSeccion.escalaDolor = nivelDolor;
      }

      // Detectar objetivos
      const objetivo = detectarObjetivo(linea);
      if (objetivo && !nuevaSeccion.objetivos.includes(objetivo)) {
        nuevaSeccion.objetivos.push(objetivo);
      }

      // Detectar secciones basadas en palabras clave
      Object.entries(palabrasClave).forEach(([seccion, keywords]) => {
        if (seccion !== "objetivos") {
          const contenido = detectarSeccion(linea, seccion, keywords);
          if (contenido) {
            nuevaSeccion[seccion] = contenido;
          }
        }
      });
    });

    setSecciones(nuevaSeccion);
  }, [secciones, detectarEscalaDolor, detectarObjetivo, detectarSeccion]);

  useEffect(() => {
    procesarTexto(notas);
  }, [notas, procesarTexto]);

  // Cargar datos del paciente si existe un ID
  useEffect(() => {
    const cargarDatosPaciente = async () => {
      if (patientId) {
        try {
          const response = await axios.get(`http://localhost:3001/api/maiple/patients/${patientId}`);
          if (response.data.notes) {
            setNotas(response.data.notes);
          }
        } catch (error) {
          console.error("Error al cargar datos del paciente:", error);
          setSnackbar({
            open: true,
            message: "Error al cargar los datos del paciente",
            severity: "error"
          });
        }
      }
    };

    cargarDatosPaciente();
  }, [patientId]);

  const guardarFicha = async () => {
    if (!patientId) {
      setSnackbar({
        open: true,
        message: "No hay un paciente seleccionado",
        severity: "error"
      });
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/maiple/patients/${patientId}`, {
        notes: notas
      });

      // Analizar el texto con la IA
      await axios.post(`http://localhost:3001/api/maiple/analyze-patient/${patientId}`);

      setSnackbar({
        open: true,
        message: "Ficha clínica guardada y analizada correctamente",
        severity: "success"
      });
    } catch (error) {
      console.error("Error al guardar la ficha:", error);
      setSnackbar({
        open: true,
        message: "Error al guardar la ficha clínica",
        severity: "error"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Ficha Clínica Virtual
      </Typography>

      <Grid container spacing={3}>
        {/* Notepad Principal */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Notas Clínicas
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={15}
              variant="outlined"
              placeholder="Escriba sus notas clínicas aquí. La IA organizará automáticamente la información..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={guardarFicha}
              sx={{ mt: 2 }}
              disabled={!patientId}
            >
              Guardar Ficha Clínica
            </Button>
          </Paper>
        </Grid>

        {/* Panel de Organización Automática */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Organización Automática
            </Typography>

            {/* Motivo de Consulta */}
            {secciones.motivoConsulta && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Motivo de Consulta
                </Typography>
                <Typography variant="body2">
                  {secciones.motivoConsulta}
                </Typography>
              </Box>
            )}

            {/* Antecedentes */}
            {secciones.antecedentes && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Antecedentes
                </Typography>
                <Typography variant="body2">
                  {secciones.antecedentes}
                </Typography>
              </Box>
            )}

            {/* Síntomas */}
            {secciones.sintomas && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Síntomas
                </Typography>
                <Typography variant="body2">
                  {secciones.sintomas}
                </Typography>
              </Box>
            )}

            {/* Escala de Dolor */}
            {secciones.escalaDolor > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Escala de Dolor
                </Typography>
                <Typography variant="h4">
                  {secciones.escalaDolor}/10
                </Typography>
              </Box>
            )}

            {/* Objetivos */}
            {secciones.objetivos.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Objetivos
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {secciones.objetivos.map((objetivo) => (
                    <Chip 
                      key={objetivo} 
                      label={objetivo} 
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Diagnóstico */}
            {secciones.diagnostico && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Diagnóstico
                </Typography>
                <Typography variant="body2">
                  {secciones.diagnostico}
                </Typography>
              </Box>
            )}

            {/* Plan de Tratamiento */}
            {secciones.planTratamiento && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Plan de Tratamiento
                </Typography>
                <Typography variant="body2">
                  {secciones.planTratamiento}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

FichaClinica.propTypes = {
  patientId: PropTypes.string.isRequired
};

export default FichaClinica;

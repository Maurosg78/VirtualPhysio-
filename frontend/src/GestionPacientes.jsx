import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import axios from 'axios';

function GestionPacientes({ onSelectPatient }) {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [nuevoPaciente, setNuevoPaciente] = useState({
    name: '',
    age: ''
  });

  // Cargar lista de pacientes
  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/maiple/patients');
      setPacientes(response.data);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNuevoPaciente({ name: '', age: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoPaciente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCrearPaciente = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/maiple/patients', nuevoPaciente);
      setPacientes(prev => [...prev, response.data.patient]);
      handleCloseDialog();
      // Seleccionar automáticamente el nuevo paciente
      handleSelectPatient(response.data.patient.id);
    } catch (error) {
      console.error('Error al crear paciente:', error);
    }
  };

  const handleSelectPatient = (patientId) => {
    setPacienteSeleccionado(patientId);
    onSelectPatient(patientId);
  };

  const handleDeletePatient = async (patientId) => {
    try {
      await axios.delete(`http://localhost:3001/api/maiple/patients/${patientId}`);
      setPacientes(prev => prev.filter(p => p.id !== patientId));
      if (pacienteSeleccionado === patientId) {
        setPacienteSeleccionado(null);
        onSelectPatient(null);
      }
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Pacientes</Typography>
          <Tooltip title="Nuevo Paciente">
            <IconButton onClick={handleOpenDialog} color="primary">
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <List>
          {pacientes.map((paciente) => (
            <ListItem
              key={paciente.id}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => handleDeletePatient(paciente.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton
                selected={pacienteSeleccionado === paciente.id}
                onClick={() => handleSelectPatient(paciente.id)}
              >
                <ListItemText
                  primary={paciente.name}
                  secondary={`Edad: ${paciente.age} años`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Diálogo para crear nuevo paciente */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Nuevo Paciente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nombre"
            type="text"
            fullWidth
            value={nuevoPaciente.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="age"
            label="Edad"
            type="number"
            fullWidth
            value={nuevoPaciente.age}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleCrearPaciente}
            variant="contained"
            disabled={!nuevoPaciente.name || !nuevoPaciente.age}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

GestionPacientes.propTypes = {
  onSelectPatient: PropTypes.func.isRequired
};

export default GestionPacientes; 
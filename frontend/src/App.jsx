import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import NexiaAssistant from './NexiaAssistant';
import ExamUploader from './components/ExamUploader';
import ExamList from './components/ExamList';

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/patients');
      if (!response.ok) {
        throw new Error('Error al cargar los pacientes');
      }
      const data = await response.json();
      setPatients(data);
      if (data.length > 0) {
        setSelectedPatientId(data[0].id);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handlePatientChange = (event) => {
    setSelectedPatientId(event.target.value);
  };

  const handleExamUploaded = () => {
    // Aquí podríamos actualizar la lista de exámenes si es necesario
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            VirtualPhysio
          </Typography>
          <FormControl sx={{ minWidth: 200, ml: 2 }}>
            <InputLabel>Paciente</InputLabel>
            <Select
              value={selectedPatientId}
              onChange={handlePatientChange}
              label="Paciente"
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Asistente Virtual" />
            <Tab label="Exámenes Médicos" />
          </Tabs>
        </Paper>

        {selectedTab === 0 && (
          <Paper sx={{ p: 2 }}>
            <NexiaAssistant 
              patientId={selectedPatientId}
              onUpdateClinicalRecord={(data) => {
                console.log('Actualización de ficha clínica:', data);
              }}
            />
          </Paper>
        )}

        {selectedTab === 1 && (
          <Box>
            <ExamUploader 
              patientId={selectedPatientId}
              onExamUploaded={handleExamUploaded}
            />
            <ExamList patientId={selectedPatientId} />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App; 
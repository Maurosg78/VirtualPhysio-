import React, { useState } from 'react';
import { Container, Grid, Box, Typography } from '@mui/material';
import GestionPacientes from './GestionPacientes';
import FichaClinica from './FichaClinica';
import TransitionWrapper from './components/TransitionWrapper';

function App() {
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <TransitionWrapper type="slide" direction="down">
          <Typography variant="h4" component="h1" gutterBottom>
            VirtualPhysio
          </Typography>
        </TransitionWrapper>
        
        <Grid container spacing={3}>
          {/* Panel de gestión de pacientes */}
          <Grid item xs={12} md={4}>
            <TransitionWrapper type="slide" direction="left">
              <GestionPacientes onSelectPatient={handlePatientSelect} />
            </TransitionWrapper>
          </Grid>
          
          {/* Panel de ficha clínica */}
          <Grid item xs={12} md={8}>
            <TransitionWrapper 
              type="fade" 
              in={!!selectedPatientId}
              timeout={500}
            >
              {selectedPatientId ? (
                <FichaClinica patientId={selectedPatientId} />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    minHeight: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    p: 3,
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    Seleccione un paciente para ver su ficha clínica
                  </Typography>
                </Box>
              )}
            </TransitionWrapper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App; 
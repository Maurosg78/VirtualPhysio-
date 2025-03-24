import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PropTypes from 'prop-types';

const ExamList = ({ patientId }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchExams();
  }, [patientId]);

  const fetchExams = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/exams/patient/${patientId}`);
      if (!response.ok) {
        throw new Error('Error al cargar los exámenes');
      }
      const data = await response.json();
      setExams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (examId) => {
    if (!window.confirm('¿Está seguro de eliminar este examen?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/exams/${examId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el examen');
      }

      setExams(exams.filter(exam => exam.id !== examId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewExam = (exam) => {
    setSelectedExam(exam);
    setOpenDialog(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Exámenes Médicos
      </Typography>

      {exams.length === 0 ? (
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="textSecondary">
            No hay exámenes médicos registrados
          </Typography>
        </Paper>
      ) : (
        <List>
          {exams.map((exam) => (
            <Paper key={exam.id} sx={{ mb: 1 }}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box>
                      <Typography variant="subtitle1">
                        {exam.type}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Fecha: {formatDate(exam.date)}
                        {exam.provider && ` • Proveedor: ${exam.provider}`}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    exam.notes && (
                      <Typography variant="body2" color="textSecondary">
                        {exam.notes}
                      </Typography>
                    )
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleViewExam(exam)}
                    sx={{ mr: 1 }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(exam.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalles del Examen
        </DialogTitle>
        <DialogContent>
          {selectedExam && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Tipo: {selectedExam.type}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Fecha: {formatDate(selectedExam.date)}
                </Typography>
                {selectedExam.provider && (
                  <Typography variant="body2" color="textSecondary">
                    Proveedor: {selectedExam.provider}
                  </Typography>
                )}
              </Grid>

              {selectedExam.results && selectedExam.results.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Resultados:
                  </Typography>
                  <List>
                    {selectedExam.results.map((result, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={result.parameter}
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                Valor: {result.value} {result.unit}
                              </Typography>
                              {result.reference && (
                                <Typography variant="body2" color="textSecondary">
                                  Referencia: {result.reference}
                                </Typography>
                              )}
                              {result.status && (
                                <Chip
                                  label={result.status}
                                  color={
                                    result.status === 'Normal'
                                      ? 'success'
                                      : result.status === 'Alto'
                                      ? 'error'
                                      : 'warning'
                                  }
                                  size="small"
                                  sx={{ mt: 1 }}
                                />
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}

              {selectedExam.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Notas:
                  </Typography>
                  <Typography variant="body2">
                    {selectedExam.notes}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

ExamList.propTypes = {
  patientId: PropTypes.string.isRequired
};

export default ExamList; 
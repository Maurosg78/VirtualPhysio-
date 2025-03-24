import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  MenuItem, 
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useError } from '../context/ErrorContext';
import PropTypes from 'prop-types';

const ExamUploader = ({ patientId, onExamUploaded }) => {
  const [file, setFile] = useState(null);
  const [examType, setExamType] = useState('');
  const [examDate, setExamDate] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showError } = useError();

  const examTypes = [
    { value: 'radiografia', label: 'Radiografía' },
    { value: 'resonancia', label: 'Resonancia Magnética' },
    { value: 'tomografia', label: 'Tomografía' },
    { value: 'ecografia', label: 'Ecografía' },
    { value: 'analisis', label: 'Análisis de Laboratorio' },
    { value: 'otro', label: 'Otro' }
  ];

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validar tipo de archivo
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        showError('Por favor, selecciona un archivo PDF o imagen válido');
        return;
      }

      // Validar tamaño (máximo 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        showError('El archivo no debe superar los 10MB');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !examType || !examDate) {
      showError('Por favor, completa todos los campos');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('examType', examType);
    formData.append('examDate', examDate);
    formData.append('patientId', patientId);

    try {
      const response = await fetch('http://localhost:3001/api/exams/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      if (!response.ok) {
        throw new Error('Error al subir el examen');
      }

      const data = await response.json();
      showError('Examen subido exitosamente', 'success');
      
      // Limpiar el formulario
      setFile(null);
      setExamType('');
      setExamDate('');
      setUploadProgress(0);

      // Notificar al componente padre
      if (onExamUploaded) {
        onExamUploaded(data);
      }
    } catch (error) {
      showError('Error al subir el examen');
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Subir Nuevo Examen
      </Typography>

      <Stack spacing={3}>
        <TextField
          select
          label="Tipo de Examen"
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          fullWidth
          required
        >
          {examTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          label="Fecha del Examen"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
        />

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="exam-file-input"
        />
        <label htmlFor="exam-file-input">
          <Button
            component="span"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ height: 56 }}
          >
            {file ? file.name : 'Seleccionar Archivo'}
          </Button>
        </label>

        {isUploading && (
          <Stack spacing={1}>
            <CircularProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" color="text.secondary">
              Subiendo archivo... {uploadProgress}%
            </Typography>
          </Stack>
        )}

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={isUploading || !file || !examType || !examDate}
          fullWidth
        >
          {isUploading ? 'Subiendo...' : 'Subir Examen'}
        </Button>
      </Stack>
    </Paper>
  );
};

ExamUploader.propTypes = {
  patientId: PropTypes.string.isRequired,
  onExamUploaded: PropTypes.func
};

export default ExamUploader; 
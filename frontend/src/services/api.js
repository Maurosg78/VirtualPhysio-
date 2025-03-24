import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la llamada API:', error);
    throw error;
  }
);

export const apiService = {
  // Pacientes
  getPatients: async () => {
    try {
      const response = await api.get('/patients');
      return response.data;
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      throw error;
    }
  },

  createPatient: async (patientData) => {
    try {
      const response = await api.post('/patients', patientData);
      return response.data;
    } catch (error) {
      console.error('Error al crear paciente:', error);
      throw error;
    }
  },

  updatePatient: async (patientId, patientData) => {
    try {
      const response = await api.put(`/patients/${patientId}`, patientData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      throw error;
    }
  },

  deletePatient: async (patientId) => {
    try {
      await api.delete(`/patients/${patientId}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      throw error;
    }
  },

  // Fichas Clínicas
  getClinicalRecord: async (patientId) => {
    try {
      const response = await api.get(`/clinical-records/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener ficha clínica:', error);
      throw error;
    }
  },

  saveClinicalRecord: async (patientId, recordData) => {
    try {
      const response = await api.post(`/clinical-records/${patientId}`, recordData);
      return response.data;
    } catch (error) {
      console.error('Error al guardar ficha clínica:', error);
      throw error;
    }
  },

  // Sincronización
  syncData: async (data) => {
    try {
      const response = await api.post('/sync', data);
      return response.data;
    } catch (error) {
      console.error('Error en la sincronización:', error);
      throw error;
    }
  },

  // Utilidades
  isServerAvailable: async () => {
    try {
      await api.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  },
}; 
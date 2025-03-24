const STORAGE_KEYS = {
  PATIENTS: 'virtualphysio_patients',
  CLINICAL_RECORDS: 'virtualphysio_clinical_records',
  LAST_SYNC: 'virtualphysio_last_sync',
};

export const localStorageService = {
  // Pacientes
  savePatients: (patients) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
      return true;
    } catch (error) {
      console.error('Error al guardar pacientes en localStorage:', error);
      return false;
    }
  },

  getPatients: () => {
    try {
      const patients = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return patients ? JSON.parse(patients) : [];
    } catch (error) {
      console.error('Error al obtener pacientes de localStorage:', error);
      return [];
    }
  },

  // Fichas Clínicas
  saveClinicalRecord: (patientId, record) => {
    try {
      const records = localStorageService.getClinicalRecords();
      records[patientId] = record;
      localStorage.setItem(STORAGE_KEYS.CLINICAL_RECORDS, JSON.stringify(records));
      return true;
    } catch (error) {
      console.error('Error al guardar ficha clínica en localStorage:', error);
      return false;
    }
  },

  getClinicalRecords: () => {
    try {
      const records = localStorage.getItem(STORAGE_KEYS.CLINICAL_RECORDS);
      return records ? JSON.parse(records) : {};
    } catch (error) {
      console.error('Error al obtener fichas clínicas de localStorage:', error);
      return {};
    }
  },

  getClinicalRecord: (patientId) => {
    try {
      const records = localStorageService.getClinicalRecords();
      return records[patientId] || null;
    } catch (error) {
      console.error('Error al obtener ficha clínica de localStorage:', error);
      return null;
    }
  },

  // Sincronización
  updateLastSync: () => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Error al actualizar última sincronización:', error);
      return false;
    }
  },

  getLastSync: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch (error) {
      console.error('Error al obtener última sincronización:', error);
      return null;
    }
  },

  // Utilidades
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
      return false;
    }
  },

  isStorageAvailable: () => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}; 
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useError } from './ErrorContext';
import { localStorageService } from '../services/localStorage';
import { apiService } from '../services/api';

const SyncContext = createContext();

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutos

export function SyncProvider({ children }) {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(localStorageService.getLastSync());
  const { showError } = useError();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncData = useCallback(async () => {
    if (!isOnline) {
      showError('No hay conexión a internet. Los cambios se guardarán localmente.');
      return false;
    }

    try {
      setIsSyncing(true);
      
      // Verificar disponibilidad del servidor
      const isServerAvailable = await apiService.isServerAvailable();
      if (!isServerAvailable) {
        throw new Error('El servidor no está disponible');
      }

      // Obtener datos locales
      const localPatients = localStorageService.getPatients();
      const localRecords = localStorageService.getClinicalRecords();

      // Enviar datos al servidor
      const { patients, clinicalRecords } = await apiService.syncData({
        patients: localPatients,
        clinicalRecords: localRecords,
        lastSync: lastSync,
      });
      
      // Actualizar datos locales
      localStorageService.savePatients(patients);
      Object.entries(clinicalRecords).forEach(([patientId, record]) => {
        localStorageService.saveClinicalRecord(patientId, record);
      });

      localStorageService.updateLastSync();
      setLastSync(new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Error durante la sincronización:', error);
      showError('Error al sincronizar los datos. Se mantienen los cambios locales.');
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, lastSync, showError]);

  // Configurar sincronización periódica
  useEffect(() => {
    if (!isOnline) return;

    const syncInterval = setInterval(syncData, SYNC_INTERVAL);
    return () => clearInterval(syncInterval);
  }, [isOnline, syncData]);

  const value = useMemo(() => ({
    isOnline,
    isSyncing,
    lastSync,
    syncData,
  }), [isOnline, isSyncing, lastSync, syncData]);

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
}

SyncProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync debe ser usado dentro de un SyncProvider');
  }
  return context;
} 
import React, { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Snackbar, Alert } from '@mui/material';

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);

  const hideError = () => {
    setError(null);
  };

  const value = useMemo(() => ({
    error,
    setError,
    showError: (message, severity = 'error') => {
      setError({ message, severity });
    },
    hideError
  }), [error]);

  return (
    <ErrorContext.Provider value={value}>
      {children}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={hideError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={hideError} severity={error?.severity || 'error'} sx={{ width: '100%' }}>
          {error?.message}
        </Alert>
      </Snackbar>
    </ErrorContext.Provider>
  );
}

ErrorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError debe ser usado dentro de un ErrorProvider');
  }
  return context;
} 
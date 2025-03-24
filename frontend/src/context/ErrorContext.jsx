import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Snackbar, Alert } from '@mui/material';

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);

  const showError = (message, severity = 'error') => {
    setError({ message, severity });
  };

  const hideError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
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
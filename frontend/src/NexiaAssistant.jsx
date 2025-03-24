import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  CircularProgress,
  Chip,
  Stack,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useError } from './context/ErrorContext';

const NexiaAssistant = ({ patientId, onUpdateClinicalRecord }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState('initial');
  const [suggestions, setSuggestions] = useState([]);
  const [context, setContext] = useState({ patientId });
  const messagesEndRef = useRef(null);
  const { showError } = useError();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context,
          section: currentSection
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la comunicación con el asistente');
      }

      const data = await response.json();
      
      // Actualizar el contexto y la sección actual
      setContext(prev => ({ ...prev, ...data.context }));
      setCurrentSection(data.nextSection);
      setSuggestions(data.suggestions || []);

      // Agregar la respuesta del asistente
      setMessages(prev => [...prev, { 
        text: data.response, 
        sender: 'assistant',
        suggestions: data.suggestions || []
      }]);

      // Si hay datos de ficha clínica, actualizarlos
      if (data.clinicalRecord) {
        onUpdateClinicalRecord(data.clinicalRecord);
      }
    } catch (error) {
      showError('Error al procesar el mensaje');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2, 
          mb: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <List sx={{ flex: 1, overflow: 'auto' }}>
          {messages.map((message, index) => (
            <ListItem 
              key={`${message.sender}-${message.text.substring(0, 10)}-${index}`}
              sx={{ 
                flexDirection: 'column', 
                alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  maxWidth: '80%',
                  backgroundColor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                  color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary'
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.text}
                </Typography>
                {message.suggestions && message.suggestions.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                    {message.suggestions.map((suggestion, idx) => (
                      <Chip
                        key={`suggestion-${suggestion.substring(0, 10)}-${idx}`}
                        label={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        size="small"
                        sx={{ 
                          backgroundColor: 'background.paper',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Paper>
            </ListItem>
          ))}
          {isLoading && (
            <ListItem sx={{ justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          variant="outlined"
          size="small"
        />
        <IconButton 
          color="primary" 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default NexiaAssistant;

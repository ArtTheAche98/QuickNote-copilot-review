import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Fab from '@mui/material/Fab';
import SearchBar from './components/SearchBar.jsx';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import NoteViewer from './components/NoteViewer';
import { notesApi } from './services/api.jsx';
import { useDebounce } from './hooks/useDebounce.jsx';

// # REVIEW_MARKER: Copilot review context


export default function App() {
  // Theme mode state with localStorage persistence
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('themeMode');
    return saved || 'light';
  });

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [viewingNote, setViewingNote] = useState(null);

  const handleView = (note) => {
    setViewingNote(note);
  };
  const handleViewClose = () => {
  setViewingNote(null);
};
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Create theme based on mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode colors
                primary: {
                  main: '#2563eb',
                  light: '#60a5fa',
                  dark: '#1e40af',
                },
                secondary: {
                  main: '#8b5cf6',
                  light: '#a78bfa',
                  dark: '#7c3aed',
                },
                background: {
                  default: '#f8fafc',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#0f172a',
                  secondary: '#475569',
                },
                divider: '#e2e8f0',
              }
            : {
                primary: {
                  main: '#60a5fa',
                  light: '#93c5fd',
                  dark: '#3b82f6',
                },
                secondary: {
                  main: '#a78bfa',
                  light: '#c4b5fd',
                  dark: '#8b5cf6',
                },
                background: {
                  default: '#0f172a',
                  paper: '#1e293b',
                },
                text: {
                  primary: '#f1f5f9',
                  secondary: '#cbd5e1',
                },
                divider: '#334155',
              }),
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h6: {
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light'
                  ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
                  : '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
                transition: 'box-shadow 0.3s ease, transform 0.2s ease',
                '&:hover': {
                  boxShadow: mode === 'light'
                    ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                    : '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
                  transform: 'translateY(-2px)',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
              contained: {
                '&:hover': {
                  backgroundColor: mode === 'light' ? '#1d4ed8' : '#3b82f6',
                },
              }
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 500,
              },
            },
          },
        },
      }),
    [mode]
  );

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notesApi.getAll(debouncedSearch);
      setNotes(response.data);
    } catch (err) {
      setError('Failed to load notes. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editingNote?.id) {
        await notesApi.update(editingNote.id, formData);
        showSnackbar('Note updated successfully');
      } else {
        await notesApi.create(formData);
        showSnackbar('Note created successfully');
      }
      setFormOpen(false);
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      showSnackbar('Failed to save note', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await notesApi.delete(id);
      showSnackbar('Note deleted');
      fetchNotes();
    } catch (err) {
      showSnackbar('Failed to delete note', 'error');
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingNote(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0} sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
              QuickNote
            </Typography>

            <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 2, color: 'text.primary' }}>
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </Box>

          <NoteList
            notes={notes}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </Container>

        <NoteForm
          open={formOpen}
          onClose={handleFormClose}
          onSave={handleSave}
          note={editingNote}
          loading={saving}
        />

        <NoteViewer
            open={Boolean(viewingNote)}
            onClose={handleViewClose}
            note={viewingNote}
            onEdit={handleEdit}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Fab
            color="primary"
            variant="extended"
            aria-label="add note"
            onClick={() => setFormOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              display: formOpen || viewingNote ? 'none' : 'flex',
              zIndex: 1000,
              px: 2,
              height: 56,
              minWidth: 56,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '& .fab-text': {
                maxWidth: 0,
                opacity: 0,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              },
              '&:hover': {
                px: 3,
                '& .fab-text': {
                  maxWidth: 100,
                  opacity: 1,
                  ml: 1,
                },
              },
            }}
        >
          <AddIcon/>
          <Box component="span" className="fab-text">
            New Note
          </Box>
        </Fab>
      </Box>
    </ThemeProvider>
  );
}

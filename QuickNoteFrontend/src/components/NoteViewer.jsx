import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ReactMarkdown from 'react-markdown';
// # REVIEW_MARKER: Copilot review context

export default function NoteViewer({ open, onClose, note, onEdit }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!note) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEdit = () => {
    onClose();
    onEdit(note);
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pb: 1,
        }}
      >
        <Box sx={{ flex: 1, pr: 2 }}>
          <Typography variant="h5" component="h2" color="text.primary" sx={{ fontWeight: 600 }}>
            {note.title || 'Untitled'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Last updated: {formatDate(note.updated_at)}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {note.tags_list?.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {note.tags_list.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  bgcolor: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                  border: 1,
                  borderColor: isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.3)',
                  color: isDark ? '#93c5fd' : '#2563eb',
                  fontSize: '0.75rem',
                }}
              />
            ))}
          </Box>
        )}

        <Box
          sx={{
            color: 'text.primary',
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              color: 'text.primary',
              mt: 2,
              mb: 1,
              lineHeight: 1.4,
            },
            '& p': {
              color: 'text.secondary',
              mb: 2,
              lineHeight: 1.7,
            },
            '& ul, & ol': {
              color: 'text.secondary',
              pl: 3,
              mb: 2,
            },
            '& li': {
              mb: 0.5,
            },
            '& code': {
              bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              px: 1,
              py: 0.25,
              borderRadius: 0.5,
              fontFamily: '"Fira Code", monospace',
              fontSize: '0.9em',
            },
            '& pre': {
              bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              '& code': {
                bgcolor: 'transparent',
                p: 0,
              },
            },
            '& blockquote': {
              borderLeft: 3,
              borderColor: 'primary.main',
              pl: 2,
              ml: 0,
              color: 'text.secondary',
              fontStyle: 'italic',
            },
            '& a': {
              color: 'primary.main',
            },
            '& img': {
              maxWidth: '100%',
              borderRadius: 1,
            },
          }}
        >
          <ReactMarkdown>{note.text || '*No content*'}</ReactMarkdown>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit}>
          Edit Note
        </Button>
      </DialogActions>
    </Dialog>
  );
}
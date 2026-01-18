import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
// # REVIEW_MARKER: Copilot review context
export default function NoteForm({ open, onClose, onSave, note, loading }) {
  const [formData, setFormData] = useState({ title: '', text: '', tags: '' });
  const [previewTab, setPreviewTab] = useState(0);

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        text: note.text || '',
        tags: note.tags || '',
      });
    } else {
      setFormData({ title: '', text: '', tags: '' });
    }
    setPreviewTab(0);
  }, [note, open]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const isEditing = Boolean(note?.id);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? 'Edit Note' : 'Create Note'}</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={handleChange('title')}
            required
            sx={{ mb: 2 }}
          />

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={previewTab} onChange={(_, v) => setPreviewTab(v)}>
              <Tab label="Write" />
              <Tab label="Preview" />
            </Tabs>
          </Box>

          {previewTab === 0 ? (
            <TextField
              label="Text (Markdown supported)"
              multiline
              rows={8}
              fullWidth
              value={formData.text}
              onChange={handleChange('text')}
              placeholder="Write your note here... Markdown is supported!"
            />
          ) : (
        <Box sx={{
          minHeight: 200,
          p: 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.default',
          color: 'text.primary',
          '& img': { maxWidth: '100%' },
          '& h1, & h2, & h3': { color: 'text.primary', mt: 2, mb: 1 },
          '& p': { color: 'text.secondary', mb: 1.5 },
          '& code': {
            bgcolor: 'action.hover',
            px: 0.5,
            borderRadius: 0.5,
            fontFamily: 'monospace',
          },
          '& pre': {
            bgcolor: 'action.hover',
            p: 2,
            borderRadius: 1,
            overflow: 'auto'
          },
        }}>
          <ReactMarkdown>{formData.text || '*No content*'}</ReactMarkdown>
        </Box>
          )}

          <TextField
            margin="dense"
            label="Tags (comma-separated)"
            fullWidth
            value={formData.tags}
            onChange={handleChange('tags')}
            placeholder="e.g., work, ideas, todo"
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (isEditing ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
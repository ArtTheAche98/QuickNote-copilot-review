import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Tooltip,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactMarkdown from 'react-markdown';
// # REVIEW_MARKER: Copilot review context
export default function NoteCard({ note, onEdit, onDelete, onView }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCardClick = (e) => {
    // Don't trigger if clicking on action buttons
    if (e.target.closest('.card-actions')) return;
    onView(note);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        height: '100%',
        width: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: isDark ? '#3f3f46' : '#cbd5e1',
          boxShadow: isDark
            ? '0 8px 24px rgba(0, 0, 0, 0.5)'
            : '0 8px 24px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom noWrap color="text.primary">
          {note.title || 'Untitled'}
        </Typography>

        <Box
          sx={{
            maxHeight: 80,
            overflow: 'hidden',
            mb: 2,
            position: 'relative',
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          }}
        >
        <Box
          sx={{
            color: 'text.secondary',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            wordBreak: 'break-word',
            '& p, & ul, & ol, & li, & blockquote': {
              margin: 0,
              padding: 0,
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              margin: 0,
              padding: 0,
              color: 'text.primary',
              fontSize: '0.95rem',
              fontWeight: 600,
            },
            '& code': {
              bgcolor: 'action.hover',
              px: 0.5,
              borderRadius: 0.5,
              fontFamily: 'monospace',
              fontSize: '0.8em',
            },
          }}
        >
          <ReactMarkdown>{note.text?.slice(0, 150) || ''}</ReactMarkdown>
        </Box>
        </Box>

        {note.tags_list?.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
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

        <Typography variant="caption" color="text.secondary">
          Updated: {formatDate(note.updated_at)}
        </Typography>
      </CardContent>

      <CardActions className="card-actions" sx={{ justifyContent: 'flex-end', pt: 0, pb: 1, px: 2 }}>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

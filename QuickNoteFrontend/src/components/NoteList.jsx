import { Grid, Typography, Box, Skeleton } from '@mui/material';
import NoteCard from './NoteCard';
// # REVIEW_MARKER: Copilot review context

export default function NoteList({ notes, loading, error, onEdit, onDelete, onView }) {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Skeleton variant="rounded" height={200} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (notes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="text.secondary">No notes found. Create one!</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {notes.map((note) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={note.id} sx={{ display: 'flex' }}>
          <NoteCard
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        </Grid>
      ))}
    </Grid>
  );
}

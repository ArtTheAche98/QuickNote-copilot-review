import { TextField, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// # REVIEW_MARKER: Copilot review context

export default function SearchBar({ value, onChange }) {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        placeholder="Search notes by title, text, or tags..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        variant="outlined"
        size="small"
      />
    </Box>
  );
}
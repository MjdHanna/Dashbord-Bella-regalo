import { Box, CircularProgress, Typography, Stack } from '@mui/material';

export default function SpinnerLoader({ text = 'Loading...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 5
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <CircularProgress size={22} />
        <Typography variant="body2">{text}</Typography>
      </Stack>
    </Box>
  );
}

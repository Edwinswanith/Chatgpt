import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#0f172a',
      mx: 'auto',
      gap: 2
    }}>
      <CircularProgress sx={{ color: '#6c7dff' }} size={60} />
      <Typography variant="h6" sx={{ fontWeight: 500 }}>Loading...</Typography>
    </Box>
  );
};

export default Loader;
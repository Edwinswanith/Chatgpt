import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
<<<<<<< HEAD
      color: '#333333',
      mx: 'auto' // Center horizontally
    }}>
      <CircularProgress sx={{ color: '#e0e0e0', mb: 2 }} size={60} />
      <Typography variant="h6">Loading...</Typography>
=======
      color: '#0f172a',
      mx: 'auto',
      gap: 2
    }}>
      <CircularProgress sx={{ color: '#6c7dff' }} size={60} />
      <Typography variant="h6" sx={{ fontWeight: 500 }}>Loading...</Typography>
>>>>>>> 182dae9 (Update)
    </Box>
  );
};

export default Loader;
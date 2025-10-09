import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#333333',
      mx: 'auto' // Center horizontally
    }}>
      <CircularProgress sx={{ color: '#e0e0e0', mb: 2 }} size={60} />
      <Typography variant="h6">Loading...</Typography>
    </Box>
  );
};

export default Loader;
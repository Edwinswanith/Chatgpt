import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#6F765B' },
    secondary: { main: '#D7CBB8' },
    background: { default: '#F6F1E7', paper: '#FFFFFF' },
    text: {
      primary: '#2F2A24',
      secondary: 'rgba(47, 42, 36, 0.72)',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    h4: {
      fontFamily: "'Playfair Display', 'Times New Roman', serif",
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontFamily: "'Playfair Display', 'Times New Roman', serif",
      fontSize: '1.2rem',
      fontWeight: 500,
      letterSpacing: '-0.005em',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.9rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '24px',
          fontWeight: 500,
          padding: '10px 24px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#F6F1E7',
          color: '#2F2A24',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(99, 106, 82, 0.12)',
          paddingInline: '8px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '18px',
          '&:hover': {
            backgroundColor: 'rgba(215, 203, 184, 0.22)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            padding: '10px 14px',
          },
        },
      },
    },
  },
});

export default theme; 

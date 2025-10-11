import React from 'react'
import { Box, IconButton, InputBase, Chip, Button } from '@mui/material'; // Changed TextField to InputBase and added Button
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
// Removed PictureAsPdfIcon import

const Input = ({ setInput, handleSendMessage, loading, input, files, handleFileChange, fileInputRef, handleClearFile }) => {

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  return (
<<<<<<< HEAD
    <Box sx={{ p: 2, bgcolor: '#2D403D'}}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
=======
    <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
>>>>>>> 182dae9 (Update)
            {files && files.map((file, index) => (
                <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => handleClearFile(index)}
<<<<<<< HEAD
                    sx={{ color: '#e0e0e0', bgcolor: '#555' }}
=======
                    sx={{
                        color: '#334155',
                        bgcolor: 'rgba(99, 102, 241, 0.14)',
                        borderRadius: '14px',
                        border: '1px solid rgba(99, 102, 241, 0.24)'
                    }}
>>>>>>> 182dae9 (Update)
                />
            ))}
        </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
<<<<<<< HEAD
        bgcolor: '#1b2625',
        borderRadius: '25px',
        p: '5px 20px',
        boxShadow: 'none',
=======
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '28px',
        p: '6px 22px',
        boxShadow: '0 18px 42px rgba(15, 23, 42, 0.08)',
        border: '1px solid rgba(148, 163, 184, 0.24)',
        backdropFilter: 'blur(12px)'
>>>>>>> 182dae9 (Update)
      }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*,application/pdf"
          multiple
        />
<<<<<<< HEAD
        <IconButton sx={{ color: '#e0e0e0', p: 0, mr: 1.5 }} onClick={handleAttachClick}>
=======
        <IconButton sx={{ color: '#64748b', p: 0, mr: 1.5 }} onClick={handleAttachClick}>
>>>>>>> 182dae9 (Update)
          <AttachFileIcon />
        </IconButton>

        <InputBase
            fullWidth
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
<<<<<<< HEAD
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
<<<<<<< HEAD
            sx={{ input: { color: '#e0e0e0' }, '& .MuiInputBase-input::placeholder': { color: '#888', opacity: 1 } }}
=======
=======
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                    handleSendMessage(e);
                }
            }}
>>>>>>> 2cb9e50 (Added verification feature)
            sx={{
                input: { color: '#1f2937' },
                '& .MuiInputBase-input::placeholder': { color: 'rgba(100, 116, 139, 0.9)', opacity: 1 }
            }}
>>>>>>> 182dae9 (Update)
        />
        <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={loading}
            sx={{
                ml: 1.5,
<<<<<<< HEAD
                p: '8px 16px',
                bgcolor: '#61A366',
                '&:hover': { bgcolor: '#43A047' },
                borderRadius: '20px',
                textTransform: 'none',
                fontSize: '1rem',
                color: '#fff'
=======
                p: '10px 22px',
                background: 'linear-gradient(135deg, #6c7dff 0%, #5ab0ff 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #5f6df7 0%, #4f9dff 100%)' },
                borderRadius: '999px',
                textTransform: 'none',
                fontSize: '1rem',
                color: '#fff',
                boxShadow: '0 16px 36px rgba(100, 126, 255, 0.35)'
>>>>>>> 182dae9 (Update)
            }}
        >
            Send
        </Button>
      </Box>
    </Box>
  )
}

export default Input;

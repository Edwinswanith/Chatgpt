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
    <Box sx={{ p: 2, bgcolor: '#2D403D'}}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
            {files && files.map((file, index) => (
                <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => handleClearFile(index)}
                    sx={{ color: '#e0e0e0', bgcolor: '#555' }}
                />
            ))}
        </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#1b2625',
        borderRadius: '25px',
        p: '5px 20px',
        boxShadow: 'none',
      }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*,application/pdf"
          multiple
        />
        <IconButton sx={{ color: '#e0e0e0', p: 0, mr: 1.5 }} onClick={handleAttachClick}>
          <AttachFileIcon />
        </IconButton>

        <InputBase
            fullWidth
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
            sx={{ input: { color: '#e0e0e0' }, '& .MuiInputBase-input::placeholder': { color: '#888', opacity: 1 } }}
        />
        <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={loading}
            sx={{
                ml: 1.5,
                p: '8px 16px',
                bgcolor: '#61A366',
                '&:hover': { bgcolor: '#43A047' },
                borderRadius: '20px',
                textTransform: 'none',
                fontSize: '1rem',
                color: '#fff'
            }}
        >
            Send
        </Button>
      </Box>
    </Box>
  )
}

export default Input;
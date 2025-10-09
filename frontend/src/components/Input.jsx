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
    <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
            {files && files.map((file, index) => (
                <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => handleClearFile(index)}
                    sx={{
                        color: '#334155',
                        bgcolor: 'rgba(99, 102, 241, 0.14)',
                        borderRadius: '14px',
                        border: '1px solid rgba(99, 102, 241, 0.24)'
                    }}
                />
            ))}
        </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '28px',
        p: '6px 22px',
        boxShadow: '0 18px 42px rgba(15, 23, 42, 0.08)',
        border: '1px solid rgba(148, 163, 184, 0.24)',
        backdropFilter: 'blur(12px)'
      }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*,application/pdf"
          multiple
        />
        <IconButton sx={{ color: '#64748b', p: 0, mr: 1.5 }} onClick={handleAttachClick}>
          <AttachFileIcon />
        </IconButton>

        <InputBase
            fullWidth
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
            sx={{
                input: { color: '#1f2937' },
                '& .MuiInputBase-input::placeholder': { color: 'rgba(100, 116, 139, 0.9)', opacity: 1 }
            }}
        />
        <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={loading}
            sx={{
                ml: 1.5,
                p: '10px 22px',
                background: 'linear-gradient(135deg, #6c7dff 0%, #5ab0ff 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #5f6df7 0%, #4f9dff 100%)' },
                borderRadius: '999px',
                textTransform: 'none',
                fontSize: '1rem',
                color: '#fff',
                boxShadow: '0 16px 36px rgba(100, 126, 255, 0.35)'
            }}
        >
            Send
        </Button>
      </Box>
    </Box>
  )
}

export default Input;
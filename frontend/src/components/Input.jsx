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
    <Box sx={{
      p: { xs: 1.5, md: 2 },
      bgcolor: 'transparent',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      backdropFilter: 'blur(14px)',
      boxShadow: '0 20px 45px rgba(6, 12, 34, 0.45)'
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
            {files && files.map((file, index) => (
                <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => handleClearFile(index)}
                    sx={{
                      color: '#0b1123',
                      bgcolor: 'rgba(143, 123, 255, 0.85)',
                      fontWeight: 500,
                      '& .MuiChip-deleteIcon': {
                        color: '#0b1123'
                      }
                    }}
                />
            ))}
        </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'rgba(9, 14, 30, 0.86)',
        borderRadius: '26px',
        p: { xs: '6px 12px', sm: '8px 18px' },
        boxShadow: '0 18px 38px rgba(11, 18, 48, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        gap: 1
      }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*,application/pdf"
          multiple
        />
        <IconButton
          sx={{
            color: 'var(--accent-secondary)',
            p: 0.5,
            bgcolor: 'rgba(85, 224, 255, 0.12)',
            borderRadius: '12px',
            transition: 'all 0.25s ease',
            '&:hover': {
              bgcolor: 'rgba(85, 224, 255, 0.22)',
              transform: 'translateY(-1px)'
            }
          }}
          onClick={handleAttachClick}
        >
          <AttachFileIcon />
        </IconButton>

        <InputBase
            fullWidth
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
            sx={{
              input: {
                color: 'var(--text-primary)',
                fontSize: '1.05rem',
                padding: '6px 0'
              },
              '& .MuiInputBase-input::placeholder': { color: 'var(--text-muted)', opacity: 1 }
            }}
        />
        <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={loading}
            sx={{
                ml: 1.5,
                px: { xs: 2, md: 3 },
                py: 1.1,
                background: 'linear-gradient(135deg, rgba(143, 123, 255, 0.95), rgba(98, 232, 255, 0.92))',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(143, 123, 255, 1), rgba(98, 232, 255, 1))',
                  boxShadow: '0 22px 44px rgba(90, 217, 255, 0.38)'
                },
                borderRadius: '24px',
                textTransform: 'none',
                fontSize: '1.02rem',
                color: '#071021',
                fontWeight: 600,
                boxShadow: '0 20px 40px rgba(90, 217, 255, 0.32)'
            }}
        >
            Send
        </Button>
      </Box>
    </Box>
  )
}

export default Input;
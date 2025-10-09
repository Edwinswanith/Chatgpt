import React, { useState, useEffect } from 'react'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    IconButton,
    CircularProgress,
} from '@mui/material';
import api from '../api/apiUrl';
import './HistroyBar.css'; // Import HistroyBar.css

const HistroyBar = ({ startNewChat, onSelectSession, isPending, onLogout, username }) => {
    const [sessions, setSessions] = useState([]);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await api.get('/sessions');
                setSessions(response.data);
            } catch (error) {
                console.error("Error fetching sessions:", error);
            }
        };
        fetchSessions();
    }, [refresh]);

    const refreshSessions = () => {
        setRefresh(prev => prev + 1);
    }

    const handleDeleteSession = async (sessionIdToDelete) => {
        try {
            const response = await api.delete(`/history/${sessionIdToDelete}`);

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            refreshSessions();
        } catch (error) {
            console.error("Error deleting session:", error);
        }
    };

    return (
        <Box className="history-bar-container">
            <Box className="history-bar-header">
                <Typography variant="h6" className="history-bar-title">Chat History</Typography>
                <IconButton onClick={refreshSessions} className="refresh-button">
                    <RefreshIcon />
                </IconButton>
            </Box>
            <Button
                variant="contained"
                startIcon={<ChatBubbleOutlineIcon />}
                onClick={startNewChat}
                className="new-chat-button"
            >
                New Chat
            </Button>
            <List className="history-list">
                {isPending ? (
                    <Box className="history-loading-spinner">
                        <CircularProgress />
                    </Box>
                ) : (
                    sessions.map((sessionId, index) => (
                        <ListItem
                            key={sessionId}
                            onClick={() => onSelectSession(sessionId)}
                            className="history-list-item"
                        >
                            <Button className="history-list-item-button">
                                <ChatBubbleOutlineIcon sx={{ mr: 1 }} />
                                <ListItemText primary={`Chat ${sessions.length - index}`} />
                            </Button>
                            <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleDeleteSession(sessionId);
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </ListItem>
                    ))
                )}
            </List>
            <Box className="history-bar-footer">
                <ListItem className="history-list-item">
                    <Button className="history-list-item-button">
                        <SettingsIcon sx={{ mr: 1 }} />
                        <ListItemText primary="Settings" />
                    </Button>
                </ListItem>
                <ListItem className="history-list-item">
                    <Button className="history-list-item-button">
                        <Brightness4Icon sx={{ mr: 1 }} />
                        <ListItemText primary="Dark Theme" />
                    </Button>
                </ListItem>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={onLogout}
                    className="logout-button"
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );
};

export default HistroyBar;
// Chatbot.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    CircularProgress,
    IconButton,
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    Tooltip,
    Chip,
    Popover,
    InputBase,
    Divider,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { v4 as uuidv4 } from 'uuid';
import HistroyBar from './HistroyBar';
import Loader from './Loader';
import Input from './Input';
import api from '../api/apiUrl';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import './Chatbot.css'; // Import Chatbot.css

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const TEMP_STYLE = {
<<<<<<< HEAD
  backgroundColor: '#5b799b',
  color: '#e0e0e0',
  borderRadius: '4px',
  padding: '0 2px',
};
const HIGHLIGHT_BLUE_STYLE = {
  backgroundColor: '#ADD8E6',
  color: '#000080',
  borderRadius: '4px',
  padding: '0 2px',
};
const HIGHLIGHT_GREEN_STYLE = {
  backgroundColor: '#90EE90',
  color: '#006400',
  borderRadius: '4px',
  padding: '0 2px',
=======
  backgroundColor: 'rgba(129, 140, 248, 0.25)',
  color: '#312e81',
  borderRadius: '6px',
  padding: '0 4px',
};
const HIGHLIGHT_BLUE_STYLE = {
  backgroundColor: 'rgba(96, 165, 250, 0.25)',
  color: '#1d4ed8',
  borderRadius: '6px',
  padding: '0 4px',
};
const HIGHLIGHT_GREEN_STYLE = {
  backgroundColor: 'rgba(110, 231, 183, 0.25)',
  color: '#047857',
  borderRadius: '6px',
  padding: '0 4px',
>>>>>>> 182dae9 (Update)
};
const MIN_SELECT_LEN = 2;

// Factory that creates a text renderer *without using hooks*
const makeTextRenderer = (tempPhrases, savedPhrasesWithCtx) => {
  const items = (tempPhrases || []).map((t) => ({ t, type: 'temp' }))
    .concat((savedPhrasesWithCtx || []).map(({ t, context_id }) => ({ t, type: 'saved', context_id })))
    .filter(({ t }) => (t || '').trim().length >= MIN_SELECT_LEN);

  if (items.length === 0) {
    return ({ children }) => <>{children}</>;
  }

  const parts = items.map(({ t }) => escapeRegExp(t));
  parts.sort((a, b) => b.length - a.length); // Prioritize longer matches

  const pattern = new RegExp(`(${parts.join('|')})`, 'gi');

  let highlightColorIndex = 0;
  const highlightColors = [HIGHLIGHT_BLUE_STYLE, HIGHLIGHT_GREEN_STYLE];

  return ({ children }) => {
    const processChunk = (chunk, idxOffset) => {
      if (typeof chunk !== 'string' || chunk.length === 0) return chunk;
      const split = chunk.split(pattern);
      let k = 0;
      return (
        <>
          {split.map((subChunk, idx) => {
            if (subChunk === '') return null;
            const hit = items.find(({ t }) =>
              t.toLowerCase() === subChunk.toLowerCase()
            );
            if (!hit) return <React.Fragment key={`t-${idxOffset}-${idx}-${k++}`}>{subChunk}</React.Fragment>;
            if (hit.type === 'saved') {
              const currentStyle = highlightColors[highlightColorIndex % highlightColors.length];
              highlightColorIndex++;
              return (
                <span key={`s-${idxOffset}-${idx}-${k++}`} style={currentStyle} title="Saved highlight">
                  {subChunk}
                </span>
              );
            }
            return (
              <span key={`x-${idxOffset}-${idx}-${k++}`} style={TEMP_STYLE}>
                {subChunk}
              </span>
            );
          })}
        </>
      );
    };

    return <>{React.Children.map(children, (child, idx) => processChunk(child, idx))}</>;
  };
};

const Chatbot = ({ user, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [isHistoryBarOpen, setIsHistoryBarOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [contextId, setContextId] = useState(null); // Define contextId state
  const [miniChatHistory, setMiniChatHistory] = useState([]); // Define miniChatHistory state
  const fileInputRef = React.useRef(null);

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  // Mini-chat states
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [selectedMsgIndex, setSelectedMsgIndex] = useState(null);
  const [savedPhrases, setSavedPhrases] = useState([]); // [{ t, context_id }]
  const [miniChatMessages, setMiniChatMessages] = useState([]);
  const [miniChatInput, setMiniChatInput] = useState('');
  const [miniChatLoading, setMiniChatLoading] = useState(false);
  const [miniChatContextId, setMiniChatContextId] = useState(null);
  const [tempHighlightedPhrases, setTempHighlightedPhrases] = useState([]); // New state for temporary highlights

  useEffect(() => {
    setIsHistoryBarOpen(isLargeScreen);
  }, [isLargeScreen]);

  useEffect(() => {
    if (!sessionId) {
      setSessionId(uuidv4());
    }
  }, [sessionId]);

  const TextWithHighlights = useMemo(
    () => makeTextRenderer(tempHighlightedPhrases, savedPhrases),
    [tempHighlightedPhrases, savedPhrases]
  );

  const startNewChat = useCallback(() => {
    setMessages([]);
    setInput('');
    setFiles([]);
    // Reset mini-chat states
    setContextId(null);
    setMiniChatHistory([]);
    setAnchorEl(null);
    setSelectedText('');
    setSelectedMsgIndex(null);
    setMiniChatMessages([]);
    setMiniChatInput('');
    setMiniChatLoading(false);
    setMiniChatContextId(null);
    setTempHighlightedPhrases([]); // Clear temporary highlights on new chat
    }, [setContextId, setMiniChatHistory]);

  const fetchHistory = useCallback(async (sId) => {
    setHistoryLoading(true);
    try {
      const response = await api.get(`/history?sessionId=${sId}`);
      setMessages(response.data.messages);
      setSavedPhrases(response.data.highlights.map(h => ({ t: h.phrase, context_id: h.context_id })));
    } catch (error) {
      console.error("Error fetching history:", error);
      setMessages([]);
      setSavedPhrases([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const selectSession = useCallback((sId) => {
    setSessionId(sId);
    setIsHistoryBarOpen(false);
    fetchHistory(sId);
    // Clear mini-chat states when selecting a new session
    setAnchorEl(null);
    setSelectedText('');
    setSelectedMsgIndex(null);
    setMiniChatMessages([]);
    setMiniChatInput('');
    setMiniChatLoading(false);
    setMiniChatContextId(null);
    setTempHighlightedPhrases([]); // Clear temporary highlights when selecting a new session
    }, [fetchHistory, setContextId, setMiniChatHistory]);

  useEffect(() => {
    if (user && !sessionId) {
      startNewChat();
    } else if (user && sessionId) {
      fetchHistory(sessionId);
    }
  }, [sessionId, startNewChat, user, fetchHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && files.length === 0) return;

    const userMessage = { 
        sender: 'user', 
        text: input, 
        image_data: files.map(file => file.data), 
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setLoading(true);

    const payload = {
        message: input, 
        sessionId: sessionId, 
        images: files.map(file => file.data), 
    };

    try {
        const response = await fetch(`${api.defaults.baseURL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let botResponseText = '';
            const reader = response.body.getReader();
        const decoder = new TextDecoder();

        setMessages(prevMessages => [
            ...prevMessages,
                { sender: 'bot', text: '', image_data: []}
        ]);

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            botResponseText += chunk;
            setMessages(prevMessages => {
                const lastMessage = { ...prevMessages[prevMessages.length - 1] };
                lastMessage.text = botResponseText;
                return [...prevMessages.slice(0, -1), lastMessage];
            });
        }
    } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: 'bot', text: 'Error: Could not get a response.', image_data: [] }
        ]);
    } finally {
        setLoading(false);
        setInput('');
        setFiles([]);
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Read the file as Data URL and add to files state, regardless of type
            setFiles(prevFiles => [...prevFiles, { name: file.name, data: reader.result }]);
        };
        reader.readAsDataURL(file);
    });
  };

  const handleClearFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const toggleHistoryBar = () => {
    if (!isLargeScreen) {
      setIsHistoryBarOpen(!isHistoryBarOpen);
    }
  };

  // Mini-chat functions
  const handleTextSelect = (event, messageIndex) => {
    const sel = window.getSelection();
    const text = (sel?.toString() || '').trim();
    if (!text || text.length < MIN_SELECT_LEN) return;
    if (!event.currentTarget.contains(sel.anchorNode)) return;

    setSelectedText(text);
    setSelectedMsgIndex(messageIndex);
        setTempHighlightedPhrases([text]);

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setAnchorEl({
      getBoundingClientRect: () => rect,
      clientWidth: rect.width,
      clientHeight: rect.height,
    });

    handleAskSelection(text);
  };

  const handleAskSelection = async (textToAsk) => {
    setMiniChatLoading(true);
    try {
      const response = await api.post('/ask_selection', { text: textToAsk });
      if (response.data && response.data.response) {
        setMiniChatMessages([{ text: response.data.response, sender: 'bot' }]);
        setMiniChatContextId(response.data.context_id);
      } else {
        setMiniChatMessages([{ text: 'Error: Could not get a response.', sender: 'bot' }]);
      }
    } catch (e) {
      console.error('Error sending text for asking:', e);
      setMiniChatMessages([{ text: 'Error: Could not get a response.', sender: 'bot' }]);
    } finally {
      setMiniChatLoading(false);
    }
  };

  const handleSendMiniChatMessage = async () => {
    if (!miniChatInput.trim()) return;
    const userMiniMessage = { text: miniChatInput, sender: 'user' };
    setMiniChatMessages((prev) => [...prev, userMiniMessage]);
    setMiniChatInput('');
    setMiniChatLoading(true);

    try {
      const response = await fetch(`${api.defaults.baseURL}/mini_chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedText,
          query: userMiniMessage.text,
          context_id: miniChatContextId,
          history: miniChatMessages,
        }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessageText = '';
      setMiniChatMessages((prev) => [...prev, { text: '', sender: 'bot', isStreaming: true }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        botMessageText += chunk;

        setMiniChatMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 ? { ...msg, text: botMessageText, isStreaming: true } : msg
          )
        );
      }

      setMiniChatMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 ? { ...msg, text: botMessageText, isStreaming: false } : msg
        )
      );
    } catch (e) {
      console.error('Error sending text for mini chat:', e);
      setMiniChatMessages((prev) =>
        prev ? prev.filter((m) => !(m.sender === 'user' && m.text === userMiniMessage.text)) : []
      );
      setMiniChatMessages((prev) => [...prev, { text: 'Error: Could not get a response.', sender: 'bot' }]);
    } finally {
      setMiniChatLoading(false);
    }
  };

  const handleClosePopover = () => {
    if (selectedText && miniChatContextId && sessionId) {
      setSavedPhrases((prev) => [...prev, { t: selectedText, context_id: miniChatContextId }]);
      api.post('/save_highlight', {
        phrase: selectedText,
        context_id: miniChatContextId,
        session_id: sessionId,
      }).catch(error => console.error('Error saving highlight:', error));
    }

    const ae = document.activeElement;
    if (ae && typeof ae.blur === 'function') ae.blur();

    setAnchorEl(null);
    setSelectedText('');
    setSelectedMsgIndex(null);
    setMiniChatMessages([]);
    setMiniChatInput('');
    setMiniChatContextId(null);
        setTempHighlightedPhrases([]);
  };

  const openPopover = Boolean(anchorEl);

  return (
        <Box className="chatbot-root">
      {(isHistoryBarOpen || isLargeScreen) && (
        <HistroyBar 
          startNewChat={startNewChat} 
          onSelectSession={selectSession} 
          isPending={historyLoading}
          onLogout={onLogout}
          username={user.username}
        />
      )}

            <Box className="chat-main-content" sx={{ width: isHistoryBarOpen && isLargeScreen ? 'calc(100vw - 280px)' : '100vw' }}>
                <AppBar position="static" className="chat-app-bar">
          <Toolbar>
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="open history"
              onClick={toggleHistoryBar}
                            sx={{ mr: 2, display: { md: 'none' } }}
            >
              {isHistoryBarOpen ? <CloseIcon /> : <HistoryIcon />}
            </IconButton>
                        <img src="/vite.svg" alt="ChatApp Logo" style={{ height: '24px', marginRight: '8px' }} />
                        <Typography variant="h6" component="div" className="chat-title">
                            ChatApp
            </Typography>
                        <Tooltip title="Toggle Dark/Light Mode">
                            <IconButton color="inherit">
                                <LightbulbOutlinedIcon />
                            </IconButton>
                        </Tooltip>
            <Tooltip title={user.username}>
                            <Avatar className="chat-avatar">{user.username.charAt(0).toUpperCase()}</Avatar>
            </Tooltip>
          </Toolbar>
        </AppBar>

                <Box className="chat-messages-container">
          {messages.map((msg, index) => (
            <Box
              key={index}
                            className="message-box"
              sx={{
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Box
                                className={msg.sender === 'user' ? 'user-message-bubble' : 'bot-message-bubble'}
              >
                {msg.image_data && msg.image_data.length > 0 && msg.sender === 'user' && msg.image_data.map((img, idx) => (
                  <Box key={idx} sx={{ mt: 1, mb: 1, textAlign: 'center' }}>
                                        <img src={img} alt="Uploaded content" className="message-image" />
                  </Box>
                ))}
                <Box onMouseUp={(e) => msg.sender === 'bot' && handleTextSelect(e, index)}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{ text: TextWithHighlights }}
                    >
                        {msg.text}
                    </ReactMarkdown>
                </Box>
              </Box>
            </Box>
          ))}
          {loading && <Loader />}
        </Box>

                <Box className="chat-input-area">
            <Input 
                input={input}
                setInput={setInput}
                handleSendMessage={handleSendMessage}
                handleFileChange={handleFileChange}
                fileInputRef={fileInputRef}
                loading={loading}
                files={files}
                handleClearFile={handleClearFile}
            />
        </Box>
      </Box>
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
        keepMounted
      >
                <Box className="mini-chat-popover-box">
                    <Box className="mini-chat-popover-header">
                        <Typography variant="subtitle2" className="mini-chat-selected-text">
              {selectedText}
            </Typography>
                        <IconButton size="small" onClick={handleClosePopover} className="mini-chat-close-button">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
                    <Divider className="mini-chat-divider" />
          {miniChatMessages.map((msg, index) => (
                        <Box key={index} className="mini-chat-message-box" sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <Box
                  className={msg.sender === 'user' ? 'mini-chat-user-message-bubble' : 'mini-chat-bot-message-bubble'}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {msg.text}
                </ReactMarkdown>
              </Box>
            </Box>
          ))}
          {miniChatLoading && (
                        <Box className="mini-chat-loader-box">
                            <Box className="mini-chat-loader-bubble">
<<<<<<< HEAD
                <CircularProgress size={16} sx={{ color: '#8cafff', mr: 1 }} />
=======
                <CircularProgress size={16} sx={{ color: '#6c7dff', mr: 1 }} />
>>>>>>> 182dae9 (Update)
                Typing...
              </Box>
            </Box>
          )}
        </Box>

                <Box className="mini-chat-input-area">
          <InputBase
                        className="mini-chat-input-base"
            placeholder="Ask a question..."
            inputProps={{ 'aria-label': 'ask a question' }}
            value={miniChatInput}
            onChange={(e) => setMiniChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMiniChatMessage();
            }}
          />
                    <IconButton color="primary" className="mini-chat-send-button" onClick={handleSendMiniChatMessage} disabled={miniChatLoading}>
            <SendIcon />
          </IconButton>
        </Box>
      </Popover>
    </Box>
  );
};

export default Chatbot;

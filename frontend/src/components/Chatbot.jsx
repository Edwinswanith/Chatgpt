// Chatbot.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SendIcon from '@mui/icons-material/Send';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

import HistroyBar from './HistroyBar';
import Loader from './Loader';
import Input from './Input';
import api from '../api/apiUrl';
import './Chatbot.css';

const escapeRegExp = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizeTextForMatch = (str = '') =>
  str
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

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
<<<<<<< HEAD
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
=======

const SAVED_HIGHLIGHT_STYLES = [
  {
    color: '#0f172a',
    backgroundColor: 'rgba(15, 23, 42, 0.12)',
    textDecoration: 'underline',
    fontWeight: 600,
    borderRadius: '4px',
    padding: '0 4px',
    cursor: 'pointer',
  },
  {
    color: '#111827',
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
    textDecoration: 'underline',
    fontWeight: 600,
    borderRadius: '4px',
    padding: '0 4px',
    cursor: 'pointer',
  },
];

>>>>>>> 2cb9e50 (Added verification feature)
const MIN_SELECT_LEN = 2;

const makeTextRenderer = (tempPhrases, savedPhrasesWithCtx, onSavedHighlightClick) => {
  const items = (tempPhrases || [])
    .map((t) => ({
      t,
      type: 'temp',
      normalized: normalizeTextForMatch(t),
    }))
    .concat(
      (savedPhrasesWithCtx || []).map(({ t, context_id, normalized }) => ({
        t,
        context_id,
        type: 'saved',
        normalized: normalized || normalizeTextForMatch(t),
      }))
    )
    .filter(
      ({ t, normalized }) =>
        (t || '').trim().length >= MIN_SELECT_LEN && normalized.length >= MIN_SELECT_LEN
    );

  if (items.length === 0) {
    return ({ children }) => <>{children}</>;
  }

  const patternParts = items.map(({ t }) => escapeRegExp(t).replace(/\s+/g, '\\s+'));
  patternParts.sort((a, b) => b.length - a.length);
  const combinedPattern = new RegExp(`(${patternParts.join('|')})`, 'gi');

  const highlightLookup = new Map();
  items.forEach((item) => {
    highlightLookup.set(item.normalized, item);
  });

  return ({ children }) => {
    const processChunk = (chunk, idxOffset) => {
      if (typeof chunk !== 'string' || chunk.length === 0) return chunk;

      const nodes = [];
      let lastIndex = 0;
      combinedPattern.lastIndex = 0;
      let match;
      let highlightColorIndex = 0;

      while ((match = combinedPattern.exec(chunk)) !== null) {
        const matchStart = match.index;
        const matchEnd = combinedPattern.lastIndex;

        if (matchStart > lastIndex) {
          nodes.push(
            <React.Fragment key={`txt-${idxOffset}-${matchStart}`}>
              {chunk.slice(lastIndex, matchStart)}
            </React.Fragment>
          );
        }

        const matchedText = chunk.slice(matchStart, matchEnd);
        const normalizedMatch = normalizeTextForMatch(matchedText);
        const hit = highlightLookup.get(normalizedMatch);

        if (!hit) {
          nodes.push(
            <React.Fragment key={`nohit-${idxOffset}-${matchStart}`}>
              {matchedText}
            </React.Fragment>
          );
        } else if (hit.type === 'saved') {
          const currentStyle = SAVED_HIGHLIGHT_STYLES[highlightColorIndex % SAVED_HIGHLIGHT_STYLES.length];
          highlightColorIndex++;
          nodes.push(
            <span
              key={`saved-${idxOffset}-${matchStart}`}
              style={currentStyle}
              title="View saved mini chat"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onSavedHighlightClick?.(hit.context_id, hit.t);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSavedHighlightClick?.(hit.context_id, hit.t);
                }
              }}
            >
              {matchedText}
            </span>
          );
        } else {
          nodes.push(
            <span key={`temp-${idxOffset}-${matchStart}`} style={TEMP_STYLE}>
              {matchedText}
            </span>
          );
        }

        lastIndex = matchEnd;
      }

      if (lastIndex < chunk.length) {
        nodes.push(
          <React.Fragment key={`tail-${idxOffset}-${lastIndex}`}>
            {chunk.slice(lastIndex)}
          </React.Fragment>
        );
      }

      return <>{nodes}</>;
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
  const [contextId, setContextId] = useState(null);

  const [miniChatHistory, setMiniChatHistory] = useState({});
  const [isMiniChatOpen, setIsMiniChatOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectedTextForSaving, setSelectedTextForSaving] = useState('');
  const [selectedTextNormalized, setSelectedTextNormalized] = useState('');
  const [selectedMsgIndex, setSelectedMsgIndex] = useState(null);
  const [savedPhrases, setSavedPhrases] = useState([]);
  const [miniChatMessages, setMiniChatMessages] = useState([]);
  const [miniChatInput, setMiniChatInput] = useState('');
  const [miniChatLoading, setMiniChatLoading] = useState(false);
  const [miniChatContextId, setMiniChatContextId] = useState(null);
  const [tempHighlightedPhrases, setTempHighlightedPhrases] = useState([]);
  const [selectionMenuPosition, setSelectionMenuPosition] = useState(null);

  const [verifyResults, setVerifyResults] = useState([]);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifyQuery, setVerifyQuery] = useState('');
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const fileInputRef = useRef(null);
  const miniChatOpenRef = useRef(false);
  const isSendingRef = useRef(false);

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const clearVerifyState = useCallback(() => {
    setVerifyResults([]);
    setVerifyError('');
    setVerifyLoading(false);
    setVerifyQuery('');
    setIsVerifyOpen(false);
  }, []);

  const handleSavedHighlightActivate = useCallback(
    async (targetContextId, phrase) => {
      if (!targetContextId) return;

      clearVerifyState();

      const resolvedPhraseRaw = (phrase || '').replace(/\u00a0/g, ' ');
      const resolvedPhrase = resolvedPhraseRaw.replace(/\s+/g, ' ').trim();
      const normalizedResolved = normalizeTextForMatch(resolvedPhrase);

      setSelectionMenuPosition(null);
      const cachedConversation = miniChatHistory[targetContextId];
      if (cachedConversation && Array.isArray(cachedConversation.messages)) {
        const hydratedMessages = cachedConversation.messages.map((msg) => ({
          text: msg?.text ?? '',
          sender: msg?.sender === 'bot' || msg?.sender === 'model' ? 'bot' : 'user',
        }));
        setMiniChatMessages(hydratedMessages);
      } else {
        setMiniChatMessages([]);
      }
      setMiniChatInput('');
      setSelectedText(resolvedPhrase);
      setSelectedTextForSaving(resolvedPhrase);
      setSelectedTextNormalized(normalizedResolved);
      setSelectedMsgIndex(null);
      setTempHighlightedPhrases(resolvedPhrase ? [resolvedPhrase] : []);
      setMiniChatContextId(targetContextId);
      setIsMiniChatOpen(true);
      miniChatOpenRef.current = true;
      setMiniChatLoading(true);

      try {
        const response = await api.get(`/mini_chat/history/${targetContextId}`);
        const historyMessages = response.data?.messages || [];
        const displayPhraseRaw = (response.data?.phrase || resolvedPhrase).replace(/\u00a0/g, ' ');
        const displayPhrase = displayPhraseRaw.replace(/\s+/g, ' ').trim();

        setSelectedText(displayPhrase);
        setSelectedTextForSaving(displayPhrase);
        setSelectedTextNormalized(normalizeTextForMatch(displayPhrase));
        setTempHighlightedPhrases(displayPhrase ? [displayPhrase] : []);

        const normalized = historyMessages.map((msg) => ({
          text: msg?.text ?? '',
          sender: msg?.sender === 'bot' || msg?.sender === 'model' ? 'bot' : 'user',
        }));

        setMiniChatMessages(normalized);
        setMiniChatHistory((prev) => ({
          ...prev,
          [targetContextId]: {
            phrase: displayPhrase,
            messages: normalized.map((msg) => ({ sender: msg.sender, text: msg.text })),
          },
        }));

        if (!historyMessages.length) {
          toast.info('No saved conversation for this highlight yet.', {
            position: 'bottom-left',
            autoClose: 2000,
          });
        }
      } catch (error) {
        console.error('Error loading saved mini chat:', error);
        toast.error('Failed to load saved mini chat', {
          position: 'bottom-left',
          autoClose: 3000,
        });
        setMiniChatMessages([]);
        setIsMiniChatOpen(false);
        miniChatOpenRef.current = false;
      } finally {
        setMiniChatLoading(false);
      }
    },
    [clearVerifyState, miniChatHistory]
  );

  useEffect(() => {
    setIsHistoryBarOpen(isLargeScreen);
  }, [isLargeScreen]);

  useEffect(() => {
    if (!sessionId) {
      setSessionId(uuidv4());
    }
  }, [sessionId]);
  const TextWithHighlights = useMemo(
    () => makeTextRenderer(tempHighlightedPhrases, savedPhrases, handleSavedHighlightActivate),
    [tempHighlightedPhrases, savedPhrases, handleSavedHighlightActivate]
  );

  const startNewChat = useCallback(() => {
    const previousSessionId = sessionId;
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setMessages([]);
    setInput('');
    setFiles([]);
    clearVerifyState();
    if (previousSessionId) {
      api.delete(`/history/${previousSessionId}`).catch((error) => {
        console.error('Error clearing history on new chat:', error);
        toast.error('Failed to clear previous chat history.', {
          position: 'top-right',
          autoClose: 3000,
        });
      });
    }
    setContextId(null);
    setMiniChatHistory({});
    setIsMiniChatOpen(false);
    setSelectedText('');
    setSelectedTextForSaving('');
    setSelectedTextNormalized('');
    setSelectedMsgIndex(null);
    setMiniChatMessages([]);
    setMiniChatInput('');
    setMiniChatLoading(false);
    setMiniChatContextId(null);
    setTempHighlightedPhrases([]);
    setSavedPhrases([]);
    setSelectionMenuPosition(null);
    miniChatOpenRef.current = false;
  }, [sessionId, clearVerifyState]);

  const fetchHistory = useCallback(
    async (sId) => {
      setHistoryLoading(true);
      try {
        const response = await api.get(`/history?sessionId=${sId}`);
        setMessages(response.data.messages);
        setSavedPhrases(
          response.data.highlights.map((h) => ({
            t: h.phrase,
            context_id: h.context_id,
            normalized: normalizeTextForMatch(h.phrase),
          }))
        );
      } catch (error) {
        console.error('Error fetching history:', error);
        toast.error('Failed to load chat history', {
          position: 'top-right',
          autoClose: 3000,
        });
        setMessages([]);
        setSavedPhrases([]);
      } finally {
        setHistoryLoading(false);
      }
    },
    []
  );

  const selectSession = useCallback(
    (sId) => {
      setSessionId(sId);
      setIsHistoryBarOpen(false);
      fetchHistory(sId);
      clearVerifyState();
      setIsMiniChatOpen(false);
      setSelectedText('');
      setSelectedTextForSaving('');
      setSelectedTextNormalized('');
      setSelectedMsgIndex(null);
      setMiniChatMessages([]);
      setMiniChatInput('');
      setMiniChatLoading(false);
      setMiniChatContextId(null);
      setMiniChatHistory({});
      setTempHighlightedPhrases([]);
      setSelectionMenuPosition(null);
      miniChatOpenRef.current = false;
    },
    [fetchHistory, clearVerifyState]
  );

  useEffect(() => {
    if (user && !sessionId) {
      startNewChat();
    } else if (user && sessionId) {
      fetchHistory(sessionId);
    }
  }, [sessionId, startNewChat, user, fetchHistory]);

  useEffect(() => {
    miniChatOpenRef.current = isMiniChatOpen;
  }, [isMiniChatOpen]);

  useEffect(() => {
    const handleDocumentSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        if (!miniChatOpenRef.current) {
          setSelectionMenuPosition(null);
          setTempHighlightedPhrases([]);
          setSelectedText('');
          setSelectedTextForSaving('');
          setSelectedTextNormalized('');
          setSelectedMsgIndex(null);
        }
      }
    };

    document.addEventListener('selectionchange', handleDocumentSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleDocumentSelectionChange);
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (isSendingRef.current || loading) {
      return;
    }
    if (!input.trim() && files.length === 0) return;

    const pendingMessageId = `pending-${Date.now()}`;
    const pendingMessage = {
      clientGeneratedId: pendingMessageId,
      sender: 'user',
      text: input,
      image_data: files.map((file) => file.data),
    };

    setMessages((prevMessages) => [...prevMessages, pendingMessage]);
    isSendingRef.current = true;
    setLoading(true);

    const payload = {
      message: input,
      sessionId,
      images: files.map((file) => file.data),
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

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'model', text: '', image_data: [] },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        botResponseText += chunk;
        setMessages((prevMessages) => {
          const lastMessage = { ...prevMessages[prevMessages.length - 1] };
          lastMessage.text = botResponseText;
          return [...prevMessages.slice(0, -1), lastMessage];
        });
      }

      await fetchHistory(sessionId);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      setMessages((prevMessages) => {
        const withoutPending = prevMessages.filter(
          (msg) =>
            msg.clientGeneratedId !== pendingMessageId &&
            !(msg.sender === 'model' && !msg.text && !msg.id)
        );
        return [
          ...withoutPending,
          { sender: 'model', text: 'Error: Could not get a response.', image_data: [] },
        ];
      });
    } finally {
      setLoading(false);
      setInput('');
      setFiles([]);
      isSendingRef.current = false;
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles((prevFiles) => [...prevFiles, { name: file.name, data: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleClearFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const toggleHistoryBar = () => {
    if (!isLargeScreen) {
      setIsHistoryBarOpen((prev) => !prev);
    }
  };

  const handleTextSelect = (event, messageIndex) => {
    clearVerifyState();
    const sel = window.getSelection();
    if (!sel) return;

    const rawSelection = sel.toString() || '';
    const condensedSelection = rawSelection.replace(/\u00a0/g, ' ');
    const trimmedSelection = condensedSelection.replace(/\s+/g, ' ').trim();
    const normalizedSelection = normalizeTextForMatch(trimmedSelection);
    const anchorNode = sel.anchorNode;

    if (
      !trimmedSelection ||
      trimmedSelection.length < MIN_SELECT_LEN ||
      normalizedSelection.length < MIN_SELECT_LEN ||
      !anchorNode ||
      !event.currentTarget.contains(anchorNode)
    ) {
      setSelectionMenuPosition(null);
      if (!isMiniChatOpen) {
        setTempHighlightedPhrases([]);
        setSelectedText('');
        setSelectedTextForSaving('');
        setSelectedTextNormalized('');
        setSelectedMsgIndex(null);
      }
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const { clientX, clientY } = event;

    const computedLeft = rect.width
      ? rect.left + window.scrollX + rect.width / 2
      : clientX + window.scrollX;
    const computedTop = rect.height || rect.width ? rect.top + window.scrollY : clientY + window.scrollY;
    const shouldPlaceAbove = computedTop > 80;
    const verticalOffset = rect.height || rect.width ? rect.height : 0;
    const topValue = shouldPlaceAbove
      ? computedTop - Math.max(verticalOffset, 24)
      : computedTop + Math.max(verticalOffset, 12);

    setSelectedText(trimmedSelection);
    setSelectedTextForSaving(trimmedSelection);
    setSelectedTextNormalized(normalizedSelection);
    setSelectedMsgIndex(messageIndex);
    setTempHighlightedPhrases([trimmedSelection]);
    setSelectionMenuPosition({
      top: Math.max(topValue, 12),
      left: computedLeft,
      placement: shouldPlaceAbove ? 'above' : 'below',
    });
  };

  const handleAskSelection = async (textToAsk) => {
    const condensed = textToAsk.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    clearVerifyState();
    setMiniChatLoading(true);
    try {
      const response = await api.post('/ask_selection', { text: condensed });
      if (response.data && response.data.response) {
        const initialMessage = { text: response.data.response, sender: 'bot' };
        const newContextId = response.data.context_id;
        setMiniChatMessages([initialMessage]);
        setMiniChatContextId(newContextId);
        setMiniChatHistory((prev) => ({
          ...prev,
          [newContextId]: {
            phrase: condensed,
            messages: [{ sender: 'bot', text: initialMessage.text }],
          },
        }));
      } else {
        setMiniChatMessages([{ text: 'Error: Could not get a response.', sender: 'bot' }]);
        toast.error('Failed to get explanation', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error sending text for asking:', error);
      toast.error('Failed to get explanation', {
        position: 'top-right',
        autoClose: 3000,
      });
      setMiniChatMessages([{ text: 'Error: Could not get a response.', sender: 'bot' }]);
    } finally {
      setMiniChatLoading(false);
    }
  };

  const handleOpenMiniChatFromSelection = () => {
    const textForQuery = (selectedTextForSaving || selectedText || '').trim();
    if (!textForQuery) return;

    setMiniChatInput('');
    setMiniChatMessages([]);
    miniChatOpenRef.current = true;
    setIsMiniChatOpen(true);
    setIsVerifyOpen(false);
    setSelectionMenuPosition(null);
    handleAskSelection(textForQuery);
  };

  const handleVerifySelection = async () => {
    const textToVerify = (selectedTextForSaving || selectedText || '').trim();
    if (!textToVerify || verifyLoading) return;

    setIsMiniChatOpen(false);
    miniChatOpenRef.current = false;
    setIsVerifyOpen(true);
    setVerifyResults([]);
    setVerifyQuery(textToVerify);
    setVerifyError('');
    setVerifyLoading(true);

    try {
      const response = await api.post('/verify_text', { text: textToVerify });
      const webResults = response.data?.results || [];
      setVerifyResults(webResults);
      if (!webResults.length) {
        setVerifyError('No web results found for this selection.');
      }
    } catch (error) {
      console.error('Error verifying selection:', error);
      const message =
        (error?.response && error.response.data && error.response.data.error) ||
        error?.message ||
        'Failed to verify the selected text.';
      setVerifyError(message);
      toast.error('Failed to verify selected text.', {
        position: 'bottom-left',
        autoClose: 3000,
      });
    } finally {
      setVerifyLoading(false);
      setSelectionMenuPosition(null);
    }
  };

  const handleCloseVerifyPanel = useCallback(() => {
    clearVerifyState();
  }, [clearVerifyState]);

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
          text: selectedTextForSaving || selectedText,
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

      if (miniChatContextId) {
        setMiniChatHistory((prev) => {
          const previousHistory = prev[miniChatContextId]?.messages || [];
          const merged = [
            ...previousHistory,
            { sender: 'user', text: userMiniMessage.text },
            { sender: 'bot', text: botMessageText },
          ];
          return {
            ...prev,
            [miniChatContextId]: {
              phrase: selectedTextForSaving || selectedText,
              messages: merged,
            },
          };
        });
      }
    } catch (error) {
      console.error('Error sending text for mini chat:', error);
      setMiniChatMessages((prev) =>
        prev ? prev.filter((m) => !(m.sender === 'user' && m.text === userMiniMessage.text)) : []
      );
      setMiniChatMessages((prev) => [...prev, { text: 'Error: Could not get a response.', sender: 'bot' }]);
    } finally {
      setMiniChatLoading(false);
    }
  };

  const handleCloseMiniChat = async () => {
    const phraseToSave = (selectedTextForSaving || selectedText || '').trim();
    const contextToSave = miniChatContextId;
    const sessionForSave = sessionId;

    const messagesToPersist = miniChatMessages
      .filter((msg) => msg && typeof msg.text === 'string' && msg.text.trim().length > 0)
      .map((msg) => ({
        sender: msg.sender === 'bot' || msg.sender === 'model' ? 'bot' : 'user',
        text: msg.text,
      }));

    if (phraseToSave && contextToSave && sessionForSave) {
      try {
        const response = await api.post('/save_highlight', {
          phrase: phraseToSave,
          context_id: contextToSave,
          session_id: sessionForSave,
          messages: messagesToPersist,
        });

        const highlightRecord = response.data?.highlight;
        if (highlightRecord) {
          setSavedPhrases((prev) => {
            const normalizedPhrase = normalizeTextForMatch(highlightRecord.phrase);
            const existingIndex = prev.findIndex((phrase) => phrase.context_id === highlightRecord.context_id);
            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = {
                t: highlightRecord.phrase,
                context_id: highlightRecord.context_id,
                normalized: normalizedPhrase,
              };
              return updated;
            }
            return [
              ...prev,
              {
                t: highlightRecord.phrase,
                context_id: highlightRecord.context_id,
                normalized: normalizedPhrase,
              },
            ];
          });
        }

        if (response.data?.message) {
          const isCreated = response.status === 201;
          const toastFn = isCreated ? toast.success : toast.info;
          toastFn(response.data.message, {
            position: 'bottom-left',
            autoClose: 2000,
          });
        }

        if (sessionForSave) {
          await fetchHistory(sessionForSave);
        }
      } catch (error) {
        console.error('Error saving highlight:', error);
        toast.error('Failed to save highlight', {
          position: 'bottom-left',
          autoClose: 3000,
        });
        setSavedPhrases((prev) => {
          if (!contextToSave || !phraseToSave) {
            return prev;
          }
          const normalizedPhrase = normalizeTextForMatch(phraseToSave);
          const existingIndex = prev.findIndex((phrase) => phrase.context_id === contextToSave);
          if (existingIndex !== -1) {
            return prev;
          }
          return [
            ...prev,
            {
              t: phraseToSave,
              context_id: contextToSave,
              normalized: normalizedPhrase,
            },
          ];
        });
      }
    }

    const activeElement = document.activeElement;
    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }

    if (contextToSave && messagesToPersist.length > 0) {
      setMiniChatHistory((prev) => ({
        ...prev,
        [contextToSave]: {
          phrase: phraseToSave,
          messages: messagesToPersist,
        },
      }));
    }

    miniChatOpenRef.current = false;
    setIsMiniChatOpen(false);
    setSelectedText('');
    setSelectedMsgIndex(null);
    setMiniChatMessages([]);
    setMiniChatInput('');
    setMiniChatContextId(null);
    if (phraseToSave) {
      setTempHighlightedPhrases([phraseToSave]);
      setSelectedTextForSaving(phraseToSave);
      setSelectedTextNormalized(normalizeTextForMatch(phraseToSave));
    } else {
      setTempHighlightedPhrases([]);
      setSelectedTextForSaving('');
      setSelectedTextNormalized('');
    }
    setSelectionMenuPosition(null);
  };

  const sidePanelOpen = isMiniChatOpen || isVerifyOpen;

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

      <Box
        className="chat-main-content"
        sx={{
          width: isHistoryBarOpen && isLargeScreen
            ? sidePanelOpen
              ? 'calc(100vw - 280px - 380px)'
              : 'calc(100vw - 280px)'
            : sidePanelOpen
            ? 'calc(100vw - 380px)'
            : '100vw',
        }}
      >
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
            <Box
              sx={{
                width: 24,
                height: 24,
                mr: 1.5,
                background: '#34D399',
                clipPath: 'polygon(50% 0%, 80% 20%, 100% 50%, 80% 80%, 50% 100%, 20% 80%, 0% 50%, 20% 20%)',
                boxShadow: '0 2px 8px rgba(52, 211, 153, 0.3)',
              }}
            />
            <Typography variant="h6" component="div" className="chat-title">
              Stellar AI
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
                {msg.image_data &&
                  msg.image_data.length > 0 &&
                  msg.sender === 'user' &&
                  msg.image_data.map((img, idx) => (
                    <Box key={idx} sx={{ mt: 1, mb: 1, textAlign: 'center' }}>
                      <img src={img} alt="Uploaded content" className="message-image" />
                    </Box>
                  ))}
                <Box
                  onMouseUp={(e) => {
                    if (msg.sender === 'model' || msg.sender === 'bot') {
                      handleTextSelect(e, index);
                    }
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{ text: TextWithHighlights }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </Box>
                {msg.sender === 'model' &&
                  msg.image_data &&
                  msg.image_data.length > 0 &&
                  msg.image_data.map((img, idx) => (
                    <Box key={idx} sx={{ mt: 1, mb: 1, textAlign: 'center' }}>
                      <img src={img} alt="Generated content" className="message-image" />
                    </Box>
                  ))}
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
            isMiniChatOpen={isMiniChatOpen}
          />
        </Box>
      </Box>

      {selectionMenuPosition && (
        <Box
          className="mini-chat-trigger-container"
          style={{
            top: selectionMenuPosition.top,
            left: selectionMenuPosition.left,
            transform:
              selectionMenuPosition.placement === 'above'
                ? 'translate(-50%, -100%)'
                : 'translate(-50%, 0)',
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Box className="selection-action-wrapper">
            <Button
              size="small"
              variant="contained"
              className="mini-chat-trigger-button"
              startIcon={<ChatBubbleOutlineIcon fontSize="small" />}
              onClick={handleOpenMiniChatFromSelection}
            >
              Ask AI
            </Button>
            <Button
              size="small"
              variant="contained"
              className="verify-trigger-button"
              startIcon={<TravelExploreIcon fontSize="small" />}
              onClick={handleVerifySelection}
              disabled={verifyLoading}
            >
              {verifyLoading ? 'Verifying…' : 'Verify'}
            </Button>
          </Box>
        </Box>
      )}

      {isVerifyOpen && (
        <Box className="verify-offset-panel">
          <Box className="verify-popover">
            <Box className="verify-popover-header">
              <Typography variant="subtitle2" className="verify-popover-title">
                Google Verification
              </Typography>
              <IconButton
                size="small"
                onClick={handleCloseVerifyPanel}
                className="verify-popover-close-button"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Divider className="verify-popover-divider" />
            <Box className="verify-popover-body">
              {verifyQuery && (
                <Typography variant="caption" className="verify-popover-query">
                  "{verifyQuery}"
                </Typography>
              )}

              {verifyLoading ? (
                <Box className="verify-popover-loading">
                  <CircularProgress size={16} sx={{ color: '#6c7dff', mr: 1 }} />
                  <Typography variant="body2">Searching the web…</Typography>
                </Box>
              ) : verifyError ? (
                <Typography variant="body2" className="verify-popover-error">
                  {verifyError}
                </Typography>
              ) : verifyResults.length > 0 ? (
                <Box className="verify-results-scroll">
                  {verifyResults.map((result, index) => (
                    <Box key={index} className="verify-result-item">
                      {result.title && (
                        <Typography variant="subtitle2" className="verify-result-title">
                          {result.title}
                        </Typography>
                      )}
                      {result.snippet && (
                        <Typography variant="body2" className="verify-result-snippet">
                          {result.snippet}
                        </Typography>
                      )}
                      {result.link && (
                        <Typography
                          component="a"
                          href={result.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="body2"
                          className="verify-result-link"
                        >
                          {result.link}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" className="verify-popover-empty">
                  No web results found for this selection.
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {isMiniChatOpen && (
        <Box className="mini-chat-offset-model">
          <Box className="mini-chat-popover-box">
            <Box className="mini-chat-popover-header">
              <Typography variant="subtitle2" className="mini-chat-selected-text">
                {selectedText}
              </Typography>
              <IconButton size="small" onClick={handleCloseMiniChat} className="mini-chat-close-button">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Divider className="mini-chat-divider" />
            {miniChatMessages.map((msg, index) => (
              <Box
                key={index}
                className="mini-chat-message-box"
                sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}
              >
                <Box
                  className={
                    msg.sender === 'user' ? 'mini-chat-user-message-bubble' : 'mini-chat-bot-message-bubble'
                  }
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
                  <CircularProgress size={16} sx={{ color: '#6c7dff', mr: 1 }} />
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
            <IconButton
              color="primary"
              className="mini-chat-send-button"
              onClick={handleSendMiniChatMessage}
              disabled={miniChatLoading}
            >
              <SendIcon />
            </IconButton>
          </Box>
<<<<<<< HEAD
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
=======
>>>>>>> 2cb9e50 (Added verification feature)
        </Box>
      )}
    </Box>
  );
};

export default Chatbot;

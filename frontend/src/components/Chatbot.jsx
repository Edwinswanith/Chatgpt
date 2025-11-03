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
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
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

const HIGHLIGHT_CACHE_KEY = 'stellar_ai_highlight_cache_v1';

const escapeRegExp = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizeTextForMatch = (str = '') =>
  str
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const TEMP_STYLE = {
<<<<<<< HEAD
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
=======
  backgroundClip: 'padding-box',
  backgroundImage: 'linear-gradient(135deg, rgba(var(--color-sand-rgb), 0.45), rgba(var(--color-soft-rgb), 0.35))',
  color: 'var(--text-primary)',
  borderRadius: '999px',
  padding: '1px 8px',
  border: '1px dashed rgba(var(--color-deep-rgb), 0.35)',
  fontWeight: 600,
>>>>>>> b32dba6 (changed ui)
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
    color: 'var(--text-primary)',
    backgroundImage: 'linear-gradient(120deg, rgba(var(--color-mid-rgb), 0.55), rgba(var(--color-deep-rgb), 0.45))',
    textDecoration: 'none',
    fontWeight: 600,
    borderRadius: '999px',
    padding: '2px 10px',
    cursor: 'pointer',
    border: '1px solid rgba(var(--color-deep-rgb), 0.45)',
    boxShadow: '0 8px 18px rgba(var(--color-deep-rgb), 0.26)',
  },
  {
    color: 'var(--text-primary)',
    backgroundImage: 'linear-gradient(120deg, rgba(var(--color-sand-rgb), 0.65), rgba(var(--color-mid-rgb), 0.5))',
    textDecoration: 'none',
    fontWeight: 600,
    borderRadius: '999px',
    padding: '2px 10px',
    cursor: 'pointer',
    border: '1px solid rgba(var(--color-mid-rgb), 0.42)',
    boxShadow: '0 8px 18px rgba(var(--color-mid-rgb), 0.3)',
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
              className="chat-highlight saved-highlight"
              data-highlight="saved"
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
            <span
              key={`temp-${idxOffset}-${matchStart}`}
              style={TEMP_STYLE}
              className="chat-highlight temp-highlight"
              data-highlight="temp"
            >
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

const Chatbot = ({ themeMode = 'light', onToggleTheme = () => {} }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [isHistoryBarOpen, setIsHistoryBarOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [contextId, setContextId] = useState(null);

  const [miniChatHistory, setMiniChatHistory] = useState({});
  const [miniChatPopups, setMiniChatPopups] = useState([]);
  const [isMiniChatPopupVisible, setIsMiniChatPopupVisible] = useState(false);
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
  const [selectionSource, setSelectionSource] = useState('none');

  const [verifyResults, setVerifyResults] = useState([]);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifyQuery, setVerifyQuery] = useState('');
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const fileInputRef = useRef(null);
  const miniChatOpenRef = useRef(false);
  const miniChatPopupsRef = useRef([]);
  const isSendingRef = useRef(false);
  const messagesContainerRef = useRef(null);
  const autoScrollRef = useRef(true);

  const scrollMessagesToBottom = useCallback(
    (behavior = 'smooth') => {
      const container = messagesContainerRef.current;
      if (!container) return;
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    },
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const cached = localStorage.getItem(HIGHLIGHT_CACHE_KEY);
      if (!cached) return;
      const parsed = JSON.parse(cached);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return;

      const sanitized = Object.entries(parsed).reduce((acc, [rawContextId, value]) => {
        if (!value || typeof value !== 'object') {
          return acc;
        }
        const contextId = String(rawContextId);
        const phrase = typeof value.phrase === 'string' ? value.phrase : '';
        const messages = Array.isArray(value.messages)
          ? value.messages
              .filter((msg) => msg && typeof msg.text === 'string')
              .map((msg) => ({
                sender: msg.sender === 'bot' || msg.sender === 'model' ? 'bot' : 'user',
                text: msg.text,
              }))
          : [];
        if (!phrase && messages.length === 0) {
          return acc;
        }
        acc[contextId] = { phrase, messages };
        return acc;
      }, {});

      const cacheEntries = Object.entries(sanitized);
      if (cacheEntries.length === 0) {
        return;
      }

      setMiniChatHistory((prev) => ({
        ...sanitized,
        ...prev,
      }));

      setSavedPhrases((prev = []) => {
        const merged = [...prev];
        cacheEntries.forEach(([contextId, value]) => {
          const phrase = value.phrase || '';
          if (!phrase.trim()) return;
          const normalized = normalizeTextForMatch(phrase);
          if (!normalized) return;

          const entry = {
            t: phrase,
            context_id: contextId,
            normalized,
          };

          const existingIndex = merged.findIndex(
            (item) =>
              item?.context_id === contextId ||
              (item && typeof item.normalized === 'string' && item.normalized === normalized)
          );

          if (existingIndex !== -1) {
            merged[existingIndex] = entry;
          } else {
            merged.push(entry);
          }
        });
        return merged;
      });
    } catch (error) {
      console.error('Failed to restore highlight cache:', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const entries = Object.entries(miniChatHistory || {});
      if (!entries.length) {
        localStorage.removeItem(HIGHLIGHT_CACHE_KEY);
        return;
      }

      const sanitized = entries.reduce((acc, [contextId, value]) => {
        if (!value || typeof value !== 'object') {
          return acc;
        }
        const phrase = typeof value.phrase === 'string' ? value.phrase : '';
        const messages = Array.isArray(value.messages)
          ? value.messages
              .filter((msg) => msg && typeof msg.text === 'string')
              .map((msg) => ({
                sender: msg.sender === 'bot' || msg.sender === 'model' ? 'bot' : 'user',
                text: msg.text,
              }))
          : [];
        acc[contextId] = { phrase, messages };
        return acc;
      }, {});

      localStorage.setItem(HIGHLIGHT_CACHE_KEY, JSON.stringify(sanitized));
    } catch (error) {
      console.error('Failed to persist highlight cache:', error);
    }
  }, [miniChatHistory]);

  const removeMiniChatPopup = useCallback((popupId) => {
    setMiniChatPopups((prev) => prev.filter((popup) => popup.id !== popupId));
  }, []);

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

      setIsMiniChatPopupVisible(false);
      setMiniChatPopups([]);
      setSelectionMenuPosition(null);
      setMiniChatInput('');
      setSelectedText(resolvedPhrase);
      setSelectedTextForSaving(resolvedPhrase);
      setSelectedTextNormalized(normalizedResolved);
      setSelectedMsgIndex(null);
      setTempHighlightedPhrases(resolvedPhrase ? [resolvedPhrase] : []);
      setMiniChatContextId(targetContextId);
      setIsMiniChatOpen(true);
      miniChatOpenRef.current = true;

      const cachedConversation = miniChatHistory[targetContextId];
      const cachedMessages = Array.isArray(cachedConversation?.messages)
        ? cachedConversation.messages
        : [];

      if (cachedMessages.length > 0) {
        const displayPhraseRaw = (cachedConversation?.phrase || resolvedPhrase).replace(/\u00a0/g, ' ');
        const displayPhrase = displayPhraseRaw.replace(/\s+/g, ' ').trim();

        const normalizedMessages = cachedMessages.map((msg) => ({
          text: msg?.text ?? '',
          sender: msg?.sender === 'bot' || msg?.sender === 'model' ? 'bot' : 'user',
        }));

        setSelectedText(displayPhrase);
        setSelectedTextForSaving(displayPhrase);
        setSelectedTextNormalized(normalizeTextForMatch(displayPhrase));
        setTempHighlightedPhrases(displayPhrase ? [displayPhrase] : []);
        setMiniChatMessages(normalizedMessages);
        setMiniChatLoading(false);
        return;
      }

      setMiniChatMessages([]);
      setMiniChatLoading(true);

      try {
        const response = await api.get(`/mini_chat/history/${targetContextId}`);
        const historyMessages = response.data?.messages || [];
        const displayPhraseRaw = (response.data?.phrase || resolvedPhrase).replace(/\u00a0/g, ' ');
        const displayPhrase = displayPhraseRaw.replace(/\s+/g, ' ').trim();

        const normalized = historyMessages.map((msg) => ({
          text: msg?.text ?? '',
          sender: msg?.sender === 'bot' || msg?.sender === 'model' ? 'bot' : 'user',
        }));

        setSelectedText(displayPhrase);
        setSelectedTextForSaving(displayPhrase);
        setSelectedTextNormalized(normalizeTextForMatch(displayPhrase));
        setTempHighlightedPhrases(displayPhrase ? [displayPhrase] : []);
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
    setMiniChatPopups([]);
    setIsMiniChatPopupVisible(false);
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
    autoScrollRef.current = true;
    miniChatOpenRef.current = false;
  }, [sessionId, clearVerifyState]);

  const fetchHistory = useCallback(
    async (sId) => {
      setHistoryLoading(true);
      try {
        const response = await api.get(`/history?sessionId=${sId}`);
        autoScrollRef.current = true;
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
      setMiniChatPopups([]);
      setIsMiniChatPopupVisible(false);
      setMiniChatHistory({});
      setTempHighlightedPhrases([]);
      setSelectionMenuPosition(null);
      miniChatOpenRef.current = false;
    },
    [fetchHistory, clearVerifyState]
  );

  useEffect(() => {
    if (!sessionId) {
      startNewChat();
    } else {
      fetchHistory(sessionId);
    }
  }, [sessionId, startNewChat, fetchHistory]);

  useEffect(() => {
    miniChatPopupsRef.current = miniChatPopups;
    miniChatOpenRef.current =
      isMiniChatOpen || (isMiniChatPopupVisible && miniChatPopups.length > 0);
  }, [isMiniChatOpen, isMiniChatPopupVisible, miniChatPopups]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      autoScrollRef.current = distanceFromBottom <= 120;
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!autoScrollRef.current) {
      return;
    }

    const raf = requestAnimationFrame(() => {
      const behavior = messages.length <= 1 ? 'auto' : 'smooth';
      scrollMessagesToBottom(behavior);
    });

    return () => cancelAnimationFrame(raf);
  }, [messages, scrollMessagesToBottom]);

  useEffect(() => {
    if (miniChatPopups.length === 0) {
      setIsMiniChatPopupVisible(false);
    }
  }, [miniChatPopups.length]);

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
        setSelectionSource('none');
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
    autoScrollRef.current = true;
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
      autoScrollRef.current = true;

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
      autoScrollRef.current = true;
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

  const handleTextSelect = (event, messageIndex, origin = 'chat') => {
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
      setSelectionSource('none');
      if (!isMiniChatOpen) {
        setTempHighlightedPhrases([]);
        setSelectedText('');
        setSelectedTextForSaving('');
        setSelectedTextNormalized('');
        setSelectedMsgIndex(null);
      }
      return;
    }

    if (origin === 'mini-chat') {
      setTempHighlightedPhrases((prev) => {
        const filtered = prev.filter(
          (phrase) => normalizeTextForMatch(phrase) !== normalizedSelection
        );
        return [trimmedSelection, ...filtered];
      });
      setSelectionMenuPosition(null);
      handleOpenMiniChatFromSelection(trimmedSelection, 'mini-chat');
      return;
    }

    if (origin === 'chat') {
      const matchedSavedHighlight = savedPhrases.find(
        (phrase) => phrase.normalized === normalizedSelection
      );
      if (matchedSavedHighlight) {
        setSelectionMenuPosition(null);
        handleSavedHighlightActivate(matchedSavedHighlight.context_id, matchedSavedHighlight.t);
        return;
      }
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

    setSelectionSource('chat');
    setSelectedText(trimmedSelection);
    setSelectedTextForSaving(trimmedSelection);
    setSelectedTextNormalized(normalizedSelection);
    setSelectedMsgIndex(messageIndex);
    setTempHighlightedPhrases((prev) => {
      const filtered = prev.filter(
        (phrase) => normalizeTextForMatch(phrase) !== normalizedSelection
      );
      return [trimmedSelection, ...filtered];
    });
    setSelectionMenuPosition({
      top: Math.max(topValue, 12),
      left: computedLeft,
      placement: shouldPlaceAbove ? 'above' : 'below',
    });
  };

  const requestPopupFollowup = useCallback(
    async (popupId, phrase, contextId, initialResponse) => {
      if (!popupId || !phrase || !contextId) return;

      const existingPopup = miniChatPopupsRef.current.find((popup) => popup.id === popupId);
      if (existingPopup && existingPopup.extraResponse) {
        return;
      }

      setMiniChatPopups((prev) =>
        prev.map((popup) =>
          popup.id === popupId ? { ...popup, loading: true, error: '' } : popup
        )
      );

      const historyForRequest = [];
      if (initialResponse) {
        historyForRequest.push({ sender: 'bot', text: initialResponse });
      }

      try {
        const response = await fetch(`${api.defaults.baseURL}/mini_chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: phrase,
            query: `Provide an additional helpful insight about "${phrase}".`,
            context_id: contextId,
            history: historyForRequest,
          }),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const botMessageText = await response.text();
        const trimmedFollowup = botMessageText.trim();

        setMiniChatPopups((prev) =>
          prev.map((popup) =>
            popup.id === popupId
              ? {
                  ...popup,
                  extraResponse: trimmedFollowup,
                  loading: false,
                  error: '',
                }
              : popup
          )
        );

        if (trimmedFollowup.length > 0) {
          setMiniChatMessages((prev) => [...prev, { text: trimmedFollowup, sender: 'bot' }]);
          setMiniChatHistory((prev) => {
            const previousHistory = prev[contextId]?.messages || [];
            return {
              ...prev,
              [contextId]: {
                phrase,
                messages: [
                  ...previousHistory,
                  { sender: 'bot', text: trimmedFollowup },
                ],
              },
            };
          });
        }
      } catch (error) {
        console.error('Error generating follow-up response:', error);
        setMiniChatPopups((prev) =>
          prev.map((popup) =>
            popup.id === popupId
              ? {
                  ...popup,
                  loading: false,
                  error: 'Failed to generate additional insight.',
                }
              : popup
          )
        );
      }
    },
    [setMiniChatPopups, setMiniChatMessages, setMiniChatHistory]
  );

  const handleAskSelection = async (textToAsk, popupId = null, origin = 'chat') => {
    const condensed = textToAsk.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    clearVerifyState();
    const isMiniChatPopupRequest = origin === 'mini-chat' && Boolean(popupId);
    if (!isMiniChatPopupRequest) {
      setMiniChatLoading(true);
    }
    if (popupId) {
      setMiniChatPopups((prev) =>
        prev.map((popup) =>
          popup.id === popupId
            ? { ...popup, phrase: condensed, loading: true, error: '', explanation: '', extraResponse: '' }
            : popup
        )
      );
    }
    try {
      const response = await api.post('/ask_selection', { text: condensed });
      if (response.data && response.data.response) {
        const initialMessage = { text: response.data.response, sender: 'bot' };
        const newContextId = response.data.context_id;
        if (!isMiniChatPopupRequest) {
          setMiniChatMessages([initialMessage]);
          setMiniChatContextId(newContextId);
        }
        setMiniChatHistory((prev) => ({
          ...prev,
          [newContextId]: {
            phrase: condensed,
            messages: [{ sender: 'bot', text: initialMessage.text }],
          },
        }));

        if (origin === 'chat' && newContextId) {
          setSavedPhrases((prev) => {
            const normalizedPhrase = normalizeTextForMatch(condensed);
            const updatedRecord = {
              t: condensed,
              context_id: newContextId,
              normalized: normalizedPhrase,
            };

            const existingIndex = prev.findIndex(
              (phrase) =>
                phrase.context_id === newContextId || phrase.normalized === normalizedPhrase
            );
            if (existingIndex !== -1) {
              const next = [...prev];
              next[existingIndex] = updatedRecord;
              return next;
            }

            return [...prev, updatedRecord];
          });
        }

        if (popupId) {
          setMiniChatPopups((prev) =>
            prev.map((popup) =>
              popup.id === popupId
                ? {
                    ...popup,
                    phrase: condensed,
                    explanation: initialMessage.text,
                    contextId: newContextId,
                    loading: false,
                    error: '',
                  }
                : popup
            )
          );
          requestPopupFollowup(popupId, condensed, newContextId, initialMessage.text);
        }
      } else {
        if (!isMiniChatPopupRequest) {
          setMiniChatMessages([{ text: 'Error: Could not get a response.', sender: 'bot' }]);
        }
        toast.error('Failed to get explanation', {
          position: 'top-right',
          autoClose: 3000,
        });
        if (popupId) {
          setMiniChatPopups((prev) =>
            prev.map((popup) =>
              popup.id === popupId
                ? { ...popup, loading: false, error: 'Failed to get explanation.' }
                : popup
            )
          );
        }
      }
    } catch (error) {
      console.error('Error sending text for asking:', error);
      toast.error('Failed to get explanation', {
        position: 'top-right',
        autoClose: 3000,
      });
      if (!isMiniChatPopupRequest) {
        setMiniChatMessages([{ text: 'Error: Could not get a response.', sender: 'bot' }]);
      }
      if (popupId) {
        setMiniChatPopups((prev) =>
          prev.map((popup) =>
            popup.id === popupId
              ? {
                  ...popup,
                  loading: false,
                  error: 'Unable to retrieve explanation.',
                }
              : popup
          )
        );
      }
    } finally {
      if (!isMiniChatPopupRequest) {
        setMiniChatLoading(false);
      }
    }
  };

  const handleOpenMiniChatFromSelection = (overrideText = null, sourceOverride = null) => {
    const textForQuery = (overrideText || selectedTextForSaving || selectedText || '').trim();
    if (!textForQuery) return;

    const effectiveSource = sourceOverride ?? selectionSource;
    const shouldSpawnPopup = effectiveSource === 'mini-chat';
    let popupId = null;

    if (shouldSpawnPopup) {
      popupId = uuidv4();
      setIsMiniChatPopupVisible(true);
      setMiniChatPopups((prev) => [
        ...prev,
        {
          id: popupId,
          phrase: textForQuery,
          explanation: '',
          extraResponse: '',
          contextId: null,
          loading: true,
          error: '',
          createdAt: Date.now(),
        },
      ]);
    } else {
      setIsMiniChatPopupVisible(false);
      setMiniChatPopups([]);
    }

    if (!shouldSpawnPopup) {
      setMiniChatInput('');
      setMiniChatMessages([]);
      miniChatOpenRef.current = true;
      setIsMiniChatOpen(true);
      setIsVerifyOpen(false);
      setSelectionMenuPosition(null);
      setSelectionSource('none');
    }

    handleAskSelection(textForQuery, popupId || undefined, effectiveSource);
  };

  const handleVerifySelection = async () => {
    const textToVerify = (selectedTextForSaving || selectedText || '').trim();
    if (!textToVerify || verifyLoading) return;

    setIsMiniChatPopupVisible(false);
    setMiniChatPopups([]);
    setSelectionSource('none');
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
    setIsMiniChatPopupVisible(false);
    setMiniChatPopups([]);
    setSelectionSource('none');
  };

  const sidePanelOpen = isMiniChatOpen || isVerifyOpen;

  return (
    <Box className="chatbot-root">
      {(isHistoryBarOpen || isLargeScreen) && (
        <HistroyBar
          startNewChat={startNewChat}
          onSelectSession={selectSession}
          isPending={historyLoading}
          onToggleTheme={onToggleTheme}
          themeMode={themeMode}
        />
      )}

      <Box
        className="chat-main-content"
        sx={{
          width: isHistoryBarOpen && isLargeScreen
            ? sidePanelOpen
              ? 'calc(100vw - 240px - 360px)'
              : 'calc(100vw - 240px)'
            : sidePanelOpen
            ? 'calc(100vw - 360px)'
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
                background: 'linear-gradient(135deg, var(--color-soft), var(--color-mid))',
                clipPath: 'polygon(50% 0%, 80% 20%, 100% 50%, 80% 80%, 50% 100%, 20% 80%, 0% 50%, 20% 20%)',
                boxShadow: '0 2px 10px rgba(var(--color-mid-rgb), 0.38)',
              }}
            />
            <Typography variant="h6" component="div" className="chat-title">
              Stellar AI
            </Typography>
            <Tooltip title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton color="inherit" onClick={onToggleTheme} className="theme-toggle-icon">
                {themeMode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box className="chat-messages-container" ref={messagesContainerRef}>
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
              onClick={() => handleOpenMiniChatFromSelection()}
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
              {verifyLoading ? 'VerifyingÃ¢â‚¬Â¦' : 'Verify'}
            </Button>
          </Box>
        </Box>
      )}

      {isMiniChatPopupVisible && miniChatPopups.length > 0 && (
        <Box className="mini-chat-popups-container">
          {miniChatPopups.map((popup) => {
            const hasExplanation = popup.explanation && popup.explanation.trim().length > 0;
            const hasExtra = popup.extraResponse && popup.extraResponse.trim().length > 0;
            return (
              <Box key={popup.id} className="mini-chat-popup-card">
                <Box className="mini-chat-popup-card-header">
                  <Tooltip title={popup.phrase}>
                    <Typography variant="subtitle2" className="mini-chat-popup-title" noWrap>
                      {popup.phrase}
                    </Typography>
                  </Tooltip>
                  <IconButton
                    size="small"
                    onClick={() => removeMiniChatPopup(popup.id)}
                    className="mini-chat-popup-close-button"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Divider className="mini-chat-popup-divider" />
                <Box className="mini-chat-popup-card-body">
                  {popup.error ? (
                    <Typography variant="body2" className="mini-chat-popup-error">
                      {popup.error}
                    </Typography>
                  ) : (
                    <>
                      <Box className="mini-chat-popup-section">
                        <Typography variant="caption" className="mini-chat-popup-label">
                          Meaning & Context
                        </Typography>
                        {hasExplanation ? (
                          <Box className="mini-chat-popup-markdown">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                              components={{ text: TextWithHighlights }}
                            >
                              {popup.explanation}
                            </ReactMarkdown>
                          </Box>
                        ) : popup.loading ? (
                          <Box className="mini-chat-popup-loading">
                            <CircularProgress size={14} />
                            <Typography variant="caption">Generating explanationÃ¢â‚¬Â¦</Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" className="mini-chat-popup-empty">
                            Explanation unavailable.
                          </Typography>
                        )}
                      </Box>
                      <Divider className="mini-chat-popup-section-divider" />
                      <Box className="mini-chat-popup-section">
                        <Typography variant="caption" className="mini-chat-popup-label">
                          Extra Insight
                        </Typography>
                        {hasExtra ? (
                          <Box className="mini-chat-popup-markdown">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                              components={{ text: TextWithHighlights }}
                            >
                              {popup.extraResponse}
                            </ReactMarkdown>
                          </Box>
                        ) : popup.loading ? (
                          <Box className="mini-chat-popup-loading">
                            <CircularProgress size={14} />
                            <Typography variant="caption">Finding more insightsÃ¢â‚¬Â¦</Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" className="mini-chat-popup-empty">
                            No additional insight generated.
                          </Typography>
                        )}
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            );
          })}
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
                  <CircularProgress size={16} sx={{ color: 'var(--text-primary)', mr: 1 }} />
                  <Typography variant="body2">Searching the webÃ¢â‚¬Â¦</Typography>
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
            <Box onMouseUp={(e) => handleTextSelect(e, null, 'mini-chat')}>
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
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{ text: TextWithHighlights }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </Box>
                </Box>
              ))}
              {miniChatLoading && (
                <Box className="mini-chat-loader-box">
                  <Box className="mini-chat-loader-bubble">
                    <CircularProgress size={16} sx={{ color: 'var(--text-primary)', mr: 1 }} />
                    Typing...
                  </Box>
                </Box>
              )}
            </Box>
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




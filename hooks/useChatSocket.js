import { useState, useRef, useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';

export const useChatSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [reconnectionAttempts, setReconnectionAttempts] = useState(0);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const authStore = useAuthStore();

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setConnectionError(null);
    }
  }, []);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    const token = auth?.token;

    if (!token) {
      console.error('No authentication token found');
      setConnectionError('No authentication token found');
      return;
    }

    console.log('🔌 Attempting to connect socket with token:', token ? 'Present' : 'Missing');

    const socketUrl = "https://dark-caldron-448714-u5.uc.r.appspot.com";

    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Check for network connectivity before connecting
    if (!navigator.onLine) {
      console.error('No network connection available');
      setConnectionError('No network connection available');
      return;
    }

    socketRef.current = io(socketUrl, {
      auth: { token },
      transports: ['polling', 'websocket'],
      timeout: 20000,
      forceNew: true,
      reconnection: false // Disable built-in reconnection to implement custom logic
    });

    // Connection events
    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current?.id);
      setIsConnected(true);
      setConnectionError(null);
      setReconnectionAttempts(0);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);

      if (reason === 'io server disconnect') {
        // The disconnection was initiated by the server, try to reconnect manually
        attemptReconnect();
      } else if (reason === 'io client disconnect') {
        // Client disconnected manually, do not reconnect
      } else {
        // Other reasons, try to reconnect
        attemptReconnect();
      }
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
      attemptReconnect();
    });

    // Listen for online/offline events to update connection status
    window.addEventListener('online', () => {
      console.log('Network online - attempting to connect socket');
      connect();
    });

    window.addEventListener('offline', () => {
      console.log('Network offline - disconnecting socket');
      disconnect();
      setConnectionError('No network connection available');
    });

    function attemptReconnect() {
      if (reconnectionAttempts >= 5) {
        console.error('Max reconnection attempts reached');
        setConnectionError('Unable to connect to chat server. Please try again later.');
        return;
      }

      const delay = Math.min(1000 * 2 ** reconnectionAttempts, 30000); // Exponential backoff max 30s
      console.log(`Attempting to reconnect in ${delay}ms`);

      reconnectTimeoutRef.current = setTimeout(() => {
        setReconnectionAttempts(prev => prev + 1);
        console.log('Reconnecting socket...');
        socketRef.current?.connect();
      }, delay);
    }
  }, [reconnectionAttempts, disconnect]);

  const joinChat = useCallback((chatId, talentId) => {
    if (!socketRef.current?.connected) {
      console.error('Socket not connected');
      return false;
    }

    if (!chatId && !talentId) {
      console.error('Either chatId or talentId is required');
      return false;
    }

    const data = {};
    if (chatId) data.chatId = chatId;
    if (talentId) data.talentId = talentId;

    socketRef.current.emit('join_chat', data);
    return true;
  }, []);

  const leaveChat = useCallback((chatId) => {
    if (!socketRef.current?.connected) return false;
    if (!chatId?.trim()) return false;
    
    socketRef.current.emit('leave_chat', { chatId });
    return true;
  }, []);

  const sendMessage = useCallback((chatId, message, receiverId, messageType = 'text') => {
    if (!socketRef.current?.connected) {
      console.error('Socket not connected');
      return false;
    }

    if (!chatId?.trim() || !message?.trim() || !receiverId?.trim()) {
      console.error('Missing required parameters for sending message');
      return false;
    }

    const data = {
      chatId: chatId.trim(),
      message: message.trim(),
      receiverId: receiverId.trim(),
      messageType
    };

    socketRef.current.emit('send_message', data);
    return true;
  }, []);

  const scheduleMeeting = useCallback((chatId, receiverId, meetingDetails) => {
    if (!socketRef.current?.connected) {
      console.error('Socket not connected');
      return false;
    }

    if (!chatId?.trim() || !receiverId?.trim() || !meetingDetails) {
      console.error('Missing required parameters for scheduling meeting');
      return false;
    }

    const data = {
      chatId: chatId.trim(),
      receiverId: receiverId.trim(),
      meetingDetails
    };

    socketRef.current.emit('schedule_meeting', data);
    return true;
  }, []);

  const markMessagesAsRead = useCallback((chatId) => {
    if (!socketRef.current?.connected) return false;
    if (!chatId?.trim()) return false;
    
    socketRef.current.emit('mark_messages_read', { chatId: chatId.trim() });
    return true;
  }, []);

  const startTyping = useCallback((chatId) => {
    if (!socketRef.current?.connected) return false;
    if (!chatId || typeof chatId !== 'string' || !chatId.trim()) return false;
    
    socketRef.current.emit('typing_start', { chatId: chatId.trim() });
    return true;
  }, []);

  const stopTyping = useCallback((chatId) => {
    if (!socketRef.current?.connected) return false;
    if (!chatId || typeof chatId !== 'string' || !chatId.trim()) return false;
    
    socketRef.current.emit('typing_stop', { chatId: chatId.trim() });
    return true;
  }, []);

  // Event listeners
  const onNewMessage = useCallback((callback) => {
    if (!socketRef.current) return;
    socketRef.current.on('new_message', callback);
  }, []);

  const onMeetingScheduled = useCallback((callback) => {
    if (!socketRef.current) return;
    socketRef.current.on('meeting_scheduled', callback);
  }, []);

  const onChatJoined = useCallback((callback) => {
    if (!socketRef.current) return;
    socketRef.current.on('chat_joined', callback);
  }, []);

  const onUserTyping = useCallback((callback) => {
    if (!socketRef.current) return;
    socketRef.current.on('user_typing', callback);
  }, []);

  const onUserStoppedTyping = useCallback((callback) => {
    if (!socketRef.current) return;
    socketRef.current.on('user_stopped_typing', callback);
  }, []);

  const onError = useCallback((callback) => {
    if (!socketRef.current) return;
    socketRef.current.on('error', callback);
  }, []);

  const removeAllListeners = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.removeAllListeners();
  }, []);

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    joinChat,
    leaveChat,
    sendMessage,
    scheduleMeeting,
    markMessagesAsRead,
    startTyping,
    stopTyping,
    onNewMessage,
    onMeetingScheduled,
    onChatJoined,
    onUserTyping,
    onUserStoppedTyping,
    onError,
    removeAllListeners
  };
};


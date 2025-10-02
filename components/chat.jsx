import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Calendar, Send, X } from 'lucide-react';
import { useChatSocket } from '@/hooks/useChatSocket';

const ChatComponent = ({ isOpen, talent, currentUserId, onClose, onMeetingScheduledProp }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    date: '',
    time: '',
    duration: '60'
  });
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  const messagesEndRef = useRef(null);

  const {
    isConnected,
    connect,
    disconnect,
    joinChat,
    leaveChat,
    sendMessage: socketSendMessage,
    scheduleMeeting: socketScheduleMeeting,
    onNewMessage,
    onMeetingScheduled,
    onChatJoined,
    onUserTyping,
    onUserStoppedTyping,
    onError,
    removeAllListeners
  } = useChatSocket();

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (isOpen && talent?.id) {
      connect();
    } else {
      if (currentChatId) {
        leaveChat(currentChatId);
      }
      removeAllListeners();
      disconnect();
      setMessages([]);
      setCurrentChatId(null);
      setIsUserOnline(false);
      setLastSeen(null);
    }
  }, [isOpen, talent?.id, connect, disconnect, joinChat, leaveChat, removeAllListeners, currentChatId]);

  useEffect(() => {
    if (isConnected && talent?.id && !currentChatId) {
      // Join chat only when connected
      joinChat(talent.id);
      setCurrentChatId(talent.id);

      onNewMessage((data) => {
        setMessages(prev => {
          const exists = prev.some(msg => msg.id === data.id);
          if (exists) return prev;
          return [...prev, {
            id: data.id,
            text: data.message,
            sender: data.senderId === currentUserId ? 'me' : 'other',
            time: new Date(data.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          }];
        });
        scrollToBottom();
      });

      onMeetingScheduled((data) => {
        setMessages(prev => [...prev, {
          id: data.id,
          text: `Meeting scheduled: ${data.meetingDetails.title}`,
          sender: 'other',
          time: new Date(data.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          meetingDetails: data.meetingDetails
        }]);
        scrollToBottom();
        onMeetingScheduledProp?.(data);
      });

      onChatJoined((data) => {
        setCurrentChatId(data.chatId);
        // Check if other user is online
        if (data.participants) {
          const otherUser = data.participants.find(p => p.id !== currentUserId);
          if (otherUser) {
            setIsUserOnline(otherUser.isOnline);
            setLastSeen(otherUser.lastSeen);
          }
        }
      });

      // Add presence tracking
      const socket = window.socket || {}; // Assuming socket is available globally or from hook
      if (socket.on) {
        socket.on('user_online', (data) => {
          if (data.userId !== currentUserId) {
            setIsUserOnline(true);
          }
        });

        socket.on('user_offline', (data) => {
          if (data.userId !== currentUserId) {
            setIsUserOnline(false);
            setLastSeen(new Date(data.lastSeen));
          }
        });
      }

      onError((error) => {
        console.error('Socket error:', error);
      });
    }
  }, [isConnected, talent?.id, currentChatId, joinChat, onNewMessage, onMeetingScheduled, onChatJoined, onError, scrollToBottom, onMeetingScheduledProp, currentUserId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !currentChatId || !isConnected) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    scrollToBottom();

    socketSendMessage(currentChatId, newMessage, talent.id);
  };

  const scheduleMeeting = () => {
    if (!meetingForm.title || !meetingForm.date || !meetingForm.time || !isConnected) return;

    const meetingDetails = {
      title: meetingForm.title,
      startTime: new Date(`${meetingForm.date}T${meetingForm.time}`).toISOString(),
      duration: meetingForm.duration,
    };

    socketScheduleMeeting(currentChatId, talent.id, meetingDetails);

    setShowMeetingModal(false);
    setMeetingForm({ title: '', date: '', time: '', duration: '60' });
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'recently';
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-lg">
              {talent?.name?.charAt(0) || 'T'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{talent?.name || 'Talent Name'}</h3>
              <p className="text-sm text-gray-500">
                {isUserOnline ? 'Online' : `Last seen ${formatLastSeen(lastSeen)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMeetingModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              style={{ color: '#5c3aec' }}
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 my-2">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Connecting to chat server...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${message.sender === 'me' ? 'order-2' : ''}`}>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.sender === 'me'
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                  style={message.sender === 'me' ? { backgroundColor: '#5c3aec' } : {}}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1 px-2">{message.time}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t">
          <div className="flex items-end gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={!isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !isConnected}
              className="p-3 text-white rounded-xl transition-all hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: '#5c3aec' }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Schedule Meeting</h3>
              <button
                onClick={() => setShowMeetingModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  placeholder="e.g., Project Discussion"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  value={meetingForm.duration}
                  onChange={(e) => setMeetingForm({ ...meetingForm, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowMeetingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={scheduleMeeting}
                  className="flex-1 px-4 py-2 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                  style={{ backgroundColor: '#5c3aec' }}
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
